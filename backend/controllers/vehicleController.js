const express = require("express");
const { Vehicle, Image, Review, User } = require("../models");

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
    return res.status(200).json(vehicles);
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

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadImages,
  submitReview,
  deleteReview,
};
