const sequelize = require("../config/database");
const UserModel = require("./User");
const AddressModel = require("./Address");
const VehicleModel = require("./Vehicle");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

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

// Seed database with admin account
const seedDatabase = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'myeveadmin@gmail.com' }
    });

    if (!existingAdmin) {
      // Create admin account
      const hashedPassword = await bcrypt.hash("Admin123!", 10);
      
      await User.create({
        username: 'admin1',
        email: 'myeveadmin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('✅ Admin account created successfully!');
      console.log('📧 Email: myeveadmin@gmail.com');
      console.log('🔑 Password: Admin123!');
    } else {
      console.log('ℹ️  Admin account already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Sync all models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ force }); // Drops & recreates tables if force = true
    console.log("✅ Database synced - all tables created");

    // Always run seeder to ensure admin exists
    await seedDatabase();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

module.exports = { db, syncDatabase, User, Address, Vehicle };
