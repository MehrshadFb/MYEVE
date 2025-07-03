const sequelize = require("../config/database");
const UserModel = require("./User");

// Initialize models
const User = UserModel(sequelize);

// Define associations here if needed in the future
// Example: User.hasMany(Order); Order.belongsTo(User);

const db = {
  sequelize,
  User,
};

// Sync all models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ force }); // Drops & recreates tables if force = true
    console.log("✅ Database synced - all tables created");

    if (force) {
      await seedDatabase();
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Optional: Seed initial data (with hashed passwords)
const seedDatabase = async () => {
  const bcrypt = require("bcrypt");

  try {
    const userCount = await User.count();
    if (userCount === 0) {
      const users = await Promise.all([
        {
          username: "admin",
          email: "admin@estore.com",
          password: await bcrypt.hash("admin123", 10),
          role: "admin",
        },
        {
          username: "john_doe",
          email: "john@example.com",
          password: await bcrypt.hash("password123", 10),
          role: "customer",
        },
        {
          username: "jane_smith",
          email: "jane@example.com",
          password: await bcrypt.hash("mypassword", 10),
          role: "customer",
        },
      ]);

      await User.bulkCreate(users);
      console.log("✅ Database seeded with initial users");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

module.exports = { db, User, syncDatabase };
