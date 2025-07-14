const express = require("express");
const { Vehicle, Image, Review } = require("../models");

// Create a new vehicle
const createVehicle = async (req, res) => {
  const { type, description, brand, model, seats, range, quantity, price } =
    req.body;

  if (!type || !brand || !model || !seats || !range || !price) {
    return res.status(400).json({
      message:
        "Missing required fields: type, brand, model, seats, range, and price are required",
    });
  }

  try {
    const vehicle = await Vehicle.create({
      type,
      description,
      brand,
      model,
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
  const { type, description, brand, model, seats, range, quantity, price } =
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
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      vehicleId: vid,
      userId: req.user.id,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (err) {
    console.error("submitReview error:", err);
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
};
