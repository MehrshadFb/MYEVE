const sequelize = require("../config/database");
const UserModel = require("./User");
const AddressModel = require("./Address");
const VehicleModel = require("./Vehicle");
const ImageModel = require("./Image");
const ReviewModel = require("./Review");
const defineShoppingCart = require("./ShoppingCart");
const defineCartItem = require("./CartItem");
const { v4: uuidv4 } = require("uuid");



// Initialize models
const User = UserModel(sequelize);
const Address = AddressModel(sequelize);
const Vehicle = VehicleModel(sequelize);
const ShoppingCart = defineShoppingCart(sequelize);
const CartItem = defineCartItem(sequelize);
const Image = ImageModel(sequelize);
const Review = ReviewModel(sequelize);

// Association: One User hasMany Addresses
User.hasMany(Address, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
});
Address.belongsTo(User, { foreignKey: "userId" });

// Association: One Vehicle hasMany Images
Vehicle.hasMany(Image, { foreignKey: "vehicleId", as: "images" });
Image.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

// Association: One Vehicle hasMany Reviews
Vehicle.hasMany(Review, {
  foreignKey: "vehicleId",
  as: "reviews",
  onDelete: "CASCADE",
});
Review.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });

// Association: One User hasMany Reviews
User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews",
  onDelete: "CASCADE",
});
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

// ShoppingCart has many CartItems
ShoppingCart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'CartItems', // MUST match the 'as' used in getCart()
});
CartItem.belongsTo(ShoppingCart, {
  foreignKey: 'cartId',
  as: 'Cart', 
});

// Association: CartItem belongsTo Vehicle
CartItem.belongsTo(Vehicle, {
  foreignKey: "vehicleId",
  targetKey: "vid",
});


const db = {
  sequelize,
  User,
  Address,
  Vehicle,
  Image,
  ShoppingCart,
  CartItem
};

// Seed database with admin account
const seedDatabase = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: "myeveadmin@gmail.com" },
    });

    if (!existingAdmin) {
      await User.create({
        username: "admin1",
        email: "myeveadmin@gmail.com",
        password: "Admin123!",
        role: "admin",
      });

      console.log("✅ Admin account created successfully!");
      console.log("📧 Email: myeveadmin@gmail.com");
      console.log("🔑 Password: Admin123!");
    } else {
      console.log("ℹ️  Admin account already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

// Sync all models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ force });
    console.log("✅ Database synced - all tables created");

    await seedDatabase();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

module.exports = {
  db,
  syncDatabase,
  User,
  Address,
  Vehicle,
  Image,
  ShoppingCart,
  CartItem,
  Review
};

