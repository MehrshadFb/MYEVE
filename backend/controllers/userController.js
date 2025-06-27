const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    // Fetch real users from database
    const users = await User.findAll({
      attributes: ["id", "name", "email", "age", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const newUser = await User.create({
      name,
      email,
      age: age || null,
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle unique constraint error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
        error: "Duplicate email",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

module.exports = { getUsers, createUser };
