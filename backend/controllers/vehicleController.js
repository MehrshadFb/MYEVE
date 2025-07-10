const express = require('express');
const { Vehicle } = require('../models');

// Create a new vehicle
const createVehicle = async (req, res) => {
  const { name, description, brand, model, quantity, price } = req.body;

  if (!name || !brand || !model || !price) {
    return res.status(400).json({
      message:
        'Missing required fields: name, brand, model, and price are required',
    });
  }

  try {
    const vehicle = await Vehicle.create({
      name,
      description,
      brand,
      model,
      quantity: quantity || 0,
      price,
    });

    return res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (err) {
    console.error('createVehicle error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(vehicles);
  } catch (err) {
    console.error('getAllVehicles error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  const { vid } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.status(200).json(vehicle);
  } catch (err) {
    console.error('getVehicleById error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  const { vid } = req.params;
  const { name, description, brand, model, quantity, price } = req.body;

  try {
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.update({
      name,
      description,
      brand,
      model,
      quantity,
      price,
    });

    return res.status(200).json({
      message: 'Vehicle updated successfully',
      vehicle,
    });
  } catch (err) {
    console.error('updateVehicle error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  const { vid } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(vid);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await vehicle.destroy();
    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('deleteVehicle error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
