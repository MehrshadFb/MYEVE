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
      expiresIn: "2h",
    });
    return res.status(200).json({
      message: "Login successful",
      token,
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

module.exports = { signUp, signIn, getAllUsers, deleteUserById };
