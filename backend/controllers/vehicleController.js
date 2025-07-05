const express = require("express");
const { Vehicle } = require("../models");

// Create a new vehicle
const createVehicle = async (req, res) => {
  const { brand, modelName, price, range, horsepower, picture } = req.body;
  
  if (!brand || !modelName || !price || !range || !horsepower) {
    return res.status(400).json({ 
      message: "Missing required fields: brand, modelName, price, range, and horsepower are required" 
    });
  }

  try {
    const vehicle = await Vehicle.create({
      brand,
      modelName,
      price,
      range,
      horsepower,
      picture
    });
    
    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle
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
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(vehicles);
  } catch (err) {
    console.error("getAllVehicles error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const vehicle = await Vehicle.findByPk(id);
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
  const { id } = req.params;
  const { brand, modelName, price, range, horsepower, picture } = req.body;
  
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    await vehicle.update({
      brand,
      modelName,
      price,
      range,
      horsepower,
      picture
    });
    
    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle
    });
  } catch (err) {
    console.error("updateVehicle error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  
  try {
    const vehicle = await Vehicle.findByPk(id);
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

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
}; 