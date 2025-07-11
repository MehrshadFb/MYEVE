const { ShoppingCart, CartItem, Vehicle } = require("../models");

//Add to cart

const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { vehicleId, quantity } = req.body;

  if (!vehicleId) {
    return res.status(400).json({ message: "vehicleId is required" });
  }

  try {
    let cart = await ShoppingCart.findOne({ where: { userId } });
    if (!cart) {
      cart = await ShoppingCart.create({ userId });
    }

    let item = await CartItem.findOne({
      where: { cartId: cart.id, vehicleId }
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({ cartId: cart.id, vehicleId, quantity });
    }

    return res.status(200).json({ message: "Vehicle added to cart" });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await ShoppingCart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: {
          model: Vehicle,
          attributes: ["vid", "name", "price", "brand", "model"]
        }
      }
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(200).json({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }

    let totalItems = 0;
    let totalAmount = 0;

    const items = cart.CartItems.map(item => {
      totalItems += item.quantity;
      totalAmount += parseFloat(item.Vehicle.price) * item.quantity;

      return {
        vehicle: item.Vehicle,
        quantity: item.quantity
      };
    });

    return res.status(200).json({ items, totalItems, totalAmount });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  getCart
};
