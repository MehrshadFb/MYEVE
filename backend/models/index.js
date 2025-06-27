const sequelize = require("../config/database");
const User = require("./User");

// Define associations here if you have relationships between models
// Example: User.hasMany(Post); Post.belongsTo(User);

const db = {
  sequelize,
  User,
  // Add other models here as you create them
  // Post: require('./Post'),
  // Comment: require('./Comment'),
};

// Sync all models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync all models
    await sequelize.sync({ force }); // force: true will drop tables if they exist
    console.log("✅ Database synced - all tables created");

    // Optional: Add some initial data
    if (force) {
      await seedDatabase();
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

// Optional: Function to seed initial data
const seedDatabase = async () => {
  try {
    const userCount = await User.count();

    if (userCount === 0) {
      await User.bulkCreate([
        { name: "John Doe", email: "john@example.com" },
        { name: "Jane Smith", email: "jane@example.com" },
        { name: "Bob Johnson", email: "bob@example.com" },
      ]);
      console.log("✅ Database seeded with initial users");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

module.exports = { db, syncDatabase };
