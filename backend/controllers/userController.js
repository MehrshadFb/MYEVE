const express = require("express");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const { User, Address } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

const signUp = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const existing = await User.findOne({
      where: { [Sequelize.Op.or]: [{ email }, { username }] },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Email or username already in use" });
    }
    const user = await User.create({ username, email, password, role });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      const validationErrors = err.errors.map(error => {
        switch (error.validatorKey) {
          case 'len':
            if (error.path === 'username') {
              return 'Username must be between 3 and 50 characters';
            } else if (error.path === 'password') {
              return 'Password must be between 8 and 100 characters';
            }
            break;
          case 'isEmail':
            return 'Please enter a valid email address';
          case 'hasSpecialChar':
            return 'Password must contain at least one special character';
          default:
            return error.message;
        }
      });
      
      return res.status(400).json({ 
        message: validationErrors.join(', ') 
      });
    }
    
    // Handle unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0].path;
      if (field === 'username') {
        return res.status(409).json({ message: "Username already exists" });
      } else if (field === 'email') {
        return res.status(409).json({ message: "Email already exists" });
      }
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d", // Extended to 7 days
    });
    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "30d", // Refresh token valid for 30 days
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Address,
          as: "addresses",
        },
      ],
    });
    return res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Note: If an admin account needs to be deleted, it must be done manually in the database by an administrator.
    const currentUser = req.user;
    // Prevent deleting own account
    if (String(currentUser.id) === String(id)) {
      return res
        .status(403)
        .json({ message: "Cannot delete your own account" });
    }
    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    // Prevent deleting another admin
    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Cannot delete another admin" });
    }
    await userToDelete.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUserById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change password" });
      }
      
      if (!(await user.validatePassword(currentPassword))) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
    }

    // Check if username or email is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username, id: { [Sequelize.Op.ne]: userId } }
      });
      if (existingUser) {
        return res.status(409).json({ message: "Username already in use" });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Sequelize.Op.ne]: userId } }
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    // Update user fields
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (newPassword) updateData.password = newPassword;

    // Use set method to ensure hooks are triggered
    if (username) user.set('username', username);
    if (email) user.set('email', email);
    if (newPassword) user.set('password', newPassword);
    
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = { signUp, signIn, getAllUsers, deleteUserById, updateProfile, refreshToken };
