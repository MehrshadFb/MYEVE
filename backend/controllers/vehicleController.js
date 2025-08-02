const express = require("express");
const { Vehicle, Image, Review, User, OrderItem } = require("../models");
const { addVehicleToCSV, exportVehiclesToCSV, importVehiclesFromCSV } = require("../utils/csvHandler");
const { Op } = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `import-${Date.now()}-${file.originalname}`);
  }
});

const csvUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || path.extname(file.originalname).toLowerCase() === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create a new vehicle
const createVehicle = async (req, res) => {
  const { type, description, brand, model, year, seats, range, quantity, price } =
    req.body;

  if (!type || !brand || !model || !year || !seats || !range || !price) {
    return res.status(400).json({
      message:
        "Missing required fields: type, brand, model, year, seats, range, and price are required",
    });
  }

  try {
    const vehicle = await Vehicle.create({
      type,
      description,
      brand,
      model,
      year: parseInt(year),
      seats: parseInt(seats),
      range: parseInt(range),
      quantity: quantity || 0,
      price,
    });

    // Add to CSV file automatically
    try {
      await addVehicleToCSV(vehicle);
    } catch (csvError) {
      console.error("Failed to add vehicle to CSV:", csvError);
      // Don't fail the request if CSV update fails
    }

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (err) {
    console.error("createVehicle error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: Image,
          as: "images",
        },
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate amount sold for each vehicle
    const vehiclesWithSales = await Promise.all(
      vehicles.map(async (vehicle) => {
        const orderCount = await OrderItem.count({
          where: { vehicleId: vehicle.vid }
        });
        
        return {
          ...vehicle.toJSON(),
          amountSold: orderCount || 0
        };
      })
    );

    return res.status(200).json(vehiclesWithSales);
  } catch (err) {
    console.error("getAllVehicles error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  const { vid } = req.params;
  try {
    const vehicle = await Vehicle.findByPk(vid, {
      include: [
        {
          model: Image,
          as: "images",
        },
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (err) {
    console.error("getVehicleById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  const { vid } = req.params;
  const { type, description, brand, model, year, seats, range, quantity, price } =
    req.body;

  try {
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.update({
      type,
      description,
      brand,
      model,
      year: parseInt(year),
      seats: parseInt(seats),
      range: parseInt(range),
      quantity,
      price,
    });

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (err) {
    console.error("updateVehicle error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  const { vid } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.destroy();
    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("deleteVehicle error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { vid } = req.params;
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const imageEntries = req.files.map((file) => ({
      url: file.location,
      vehicleId: vid,
    }));

    await Image.bulkCreate(imageEntries);

    res
      .status(201)
      .json({ message: "Images uploaded successfully", images: imageEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

const submitReview = async (req, res) => {
  const { vid } = req.params;
  const { rating, comment } = req.body;

  try {
    console.log("=== SUBMIT REVIEW DEBUG ===");
    console.log("Vehicle ID:", vid);
    console.log("User ID:", req.user?.id);
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      console.log("Vehicle not found with ID:", vid);
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    console.log("Vehicle found:", vehicle.brand, vehicle.model);

    if (!rating || rating < 1 || rating > 5) {
      console.log("Invalid rating:", rating);
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!req.user || !req.user.id) {
      console.log("User not found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Creating review with data:", {
      vehicleId: vid,
      userId: req.user.id,
      rating,
      comment
    });

    const review = await Review.create({
      vehicleId: vid,
      userId: req.user.id,
      rating,
      comment,
    });

    console.log("Review created successfully:", review.toJSON());

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (err) {
    console.error("submitReview error:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({ 
      message: "Internal server error",
      error: err.message 
    });
  }
};

const deleteReview = async (req, res) => {
  const { vid, reviewId } = req.params;

  try {
    const review = await Review.findOne({
      where: {
        rid: reviewId,
        vehicleId: vid,
      },
    });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Export vehicles to CSV
const exportCSV = async (req, res) => {
  try {
    const result = await exportVehiclesToCSV();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Export CSV error:", error);
    return res.status(500).json({ message: "Failed to export vehicles to CSV" });
  }
};

// Import vehicles from CSV
const importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const result = await importVehiclesFromCSV(req.file.path);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error("Import CSV error:", error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      message: "Failed to import vehicles from CSV",
      error: error.message 
    });
  }
};

// Download CSV file
const downloadCSV = async (req, res) => {
  try {
    // First export current data to CSV
    await exportVehiclesToCSV();
    
    const csvPath = path.join(__dirname, '../data/vehicles.csv');
    
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ message: "CSV file not found" });
    }
    
    res.download(csvPath, 'vehicles.csv', (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Failed to download CSV file" });
      }
    });
  } catch (error) {
    console.error("Download CSV error:", error);
    return res.status(500).json({ message: "Failed to prepare CSV download" });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadImages,
  submitReview,
  deleteReview,
  exportCSV,
  importCSV,
  downloadCSV,
  csvUpload, // Export multer middleware
};
