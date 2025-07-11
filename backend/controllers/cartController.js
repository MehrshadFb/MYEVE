const { ShoppingCart, CartItem} = require("../models");

//Add to Cart

exports.addToCart = async (req, res) => {
  const { vehicleId, quantity } = req.body;
  const userId = req.user.id;

  try {
    let cart = await ShoppingCart.findOne({ where: { userId } });
    if (!cart) {
      cart = await ShoppingCart.create({ userId });
    }

    let item = await CartItem.findOne({
      where: { cartId: cart.id, vehicleId },
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        vehicleId,
        quantity,
      });
    }

    res.status(200).json({ message: "Item added to cart." });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart", detail: err.message });
  }
};

//Get cart with total

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await ShoppingCart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: Vehicle,
      },
    });

    if (!cart) {
      return res.status(200).json({ items: [], totalItems: 0, totalAmount: 0 });
    }

    let totalItems = 0;
    let totalAmount = 0;

    const items = cart.CartItems.map((item) => {
      totalItems += item.quantity;
      totalAmount += parseFloat(item.Vehicle.price) * item.quantity;

      return {
        vehicle: item.Vehicle,
        quantity: item.quantity,
      };
    });

    res.status(200).json({ items, totalItems, totalAmount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", detail: err.message });
  }
};

