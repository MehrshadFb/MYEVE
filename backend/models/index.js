const sequelize = require("../config/database");
const UserModel = require("./User");
const AddressModel = require("./Address");
const VehicleModel = require("./Vehicle");

// Initialize models
const User = UserModel(sequelize);
const Address = AddressModel(sequelize);
const Vehicle = VehicleModel(sequelize);

// Association: One User hasMany Addresses
User.hasMany(Address, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
});
Address.belongsTo(User, { foreignKey: "userId" });

const db = {
  sequelize,
  User,
  Address,
  Vehicle,
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

module.exports = { db, syncDatabase, User, Address, Vehicle };
