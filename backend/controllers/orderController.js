const {
  PurchaseOrder,
  OrderItem,
  Vehicle,
  User,
  ShoppingCart,
  CartItem,
} = require("../models");
const { Op } = require("sequelize");

// Credit card validation utilities
const validateCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, "");

  // Check if it's a valid number
  if (!/^\d+$/.test(cleanNumber)) {
    return { isValid: false, type: null };
  }

  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const isValid = sum % 10 === 0;
  const type = getCardType(cleanNumber);

  return { isValid, type, lastFour: cleanNumber.slice(-4) };
};

const getCardType = (cardNumber) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]|^2[2-7]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    dinersclub: /^3[0689]/,
    jcb: /^35/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type;
    }
  }

  return "unknown";
};

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

// Calculate tax (13% HST for Ontario, Canada)
const calculateTax = (subtotal) => {
  const taxRate = 0.13; // 13% HST
  return parseFloat((subtotal * taxRate).toFixed(2));
};

// Create purchase order
const createOrder = async (req, res) => {
  const userId = req.user.id;
  const {
    billingInfo,
    shippingInfo,
    paymentInfo,
    useShippingAsBilling = false,
  } = req.body;

  try {
    // Validate required fields
    if (!billingInfo || !shippingInfo || !paymentInfo) {
      return res.status(400).json({
        message:
          "Missing required information: billing, shipping, and payment details are required",
      });
    }

    // Validate credit card
    const cardValidation = validateCreditCard(paymentInfo.cardNumber);
    if (!cardValidation.isValid) {
      return res.status(400).json({
        message: "Invalid credit card number",
      });
    }

    // Validate CVV
    if (
      !paymentInfo.cvv ||
      paymentInfo.cvv.length < 3 ||
      paymentInfo.cvv.length > 4
    ) {
      return res.status(400).json({
        message: "Invalid CVV",
      });
    }

    // Validate expiry date
    const [expMonth, expYear] = paymentInfo.expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (
      !expMonth ||
      !expYear ||
      parseInt(expMonth) < 1 ||
      parseInt(expMonth) > 12 ||
      parseInt(expYear) < currentYear ||
      (parseInt(expYear) === currentYear && parseInt(expMonth) < currentMonth)
    ) {
      return res.status(400).json({
        message: "Invalid or expired card",
      });
    }

    // Get user's cart
    const cart = await ShoppingCart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "CartItems",
          include: [
            {
              model: Vehicle,
              attributes: [
                "vid",
                "brand",
                "model",
                "year",
                "price",
                "quantity",
              ],
            },
          ],
        },
      ],
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Validate inventory and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.CartItems) {
      const vehicle = cartItem.Vehicle;

      // Check if vehicle still exists and has enough inventory
      if (!vehicle) {
        return res.status(400).json({
          message: "One or more vehicles in your cart are no longer available",
        });
      }

      if (vehicle.quantity < cartItem.quantity) {
        return res.status(400).json({
          message: `Insufficient inventory for ${vehicle.brand} ${vehicle.model}. Only ${vehicle.quantity} available.`,
        });
      }

      const itemTotal = parseFloat(vehicle.price) * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        vehicleId: vehicle.vid,
        quantity: cartItem.quantity,
        unitPrice: vehicle.price,
        totalPrice: itemTotal,
        vehicleBrand: vehicle.brand,
        vehicleModel: vehicle.model,
        vehicleYear: vehicle.year,
      });
    }

    const taxAmount = calculateTax(subtotal);
    const totalAmount = subtotal + taxAmount;

    // Generate order number
    let orderNumber;
    let orderExists = true;
    let attempts = 0;

    while (orderExists && attempts < 10) {
      orderNumber = generateOrderNumber();
      const existingOrder = await PurchaseOrder.findOne({
        where: { orderNumber },
      });
      orderExists = !!existingOrder;
      attempts++;
    }

    if (orderExists) {
      return res.status(500).json({
        message: "Unable to generate unique order number. Please try again.",
      });
    }

    // Create the order
    const order = await PurchaseOrder.create({
      userId,
      orderNumber,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      status: "pending",
      // Billing information
      billingFirstName: billingInfo.firstName,
      billingLastName: billingInfo.lastName,
      billingEmail: billingInfo.email,
      billingPhone: billingInfo.phone,
      billingStreet: billingInfo.street,
      billingCity: billingInfo.city,
      billingProvince: billingInfo.province,
      billingCountry: billingInfo.country,
      billingZip: billingInfo.zip,
      // Shipping information
      shippingFirstName: useShippingAsBilling
        ? billingInfo.firstName
        : shippingInfo.firstName,
      shippingLastName: useShippingAsBilling
        ? billingInfo.lastName
        : shippingInfo.lastName,
      shippingStreet: useShippingAsBilling
        ? billingInfo.street
        : shippingInfo.street,
      shippingCity: useShippingAsBilling ? billingInfo.city : shippingInfo.city,
      shippingProvince: useShippingAsBilling
        ? billingInfo.province
        : shippingInfo.province,
      shippingCountry: useShippingAsBilling
        ? billingInfo.country
        : shippingInfo.country,
      shippingZip: useShippingAsBilling ? billingInfo.zip : shippingInfo.zip,
      // Payment information (store securely)
      cardType: cardValidation.type,
      cardLastFour: cardValidation.lastFour,
    });

    // Create order items
    const orderItemsWithOrderId = orderItems.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await OrderItem.bulkCreate(orderItemsWithOrderId);

    // Update vehicle quantities
    for (const cartItem of cart.CartItems) {
      const vehicle = cartItem.Vehicle;
      await vehicle.update({
        quantity: vehicle.quantity - cartItem.quantity,
      });
    }

    // Clear the user's cart
    await CartItem.destroy({
      where: { cartId: cart.id },
    });

    return res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await PurchaseOrder.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vid", "brand", "model", "year"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("getUserOrders error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  try {
    const whereClause = isAdmin ? { id: orderId } : { id: orderId, userId };

    const order = await PurchaseOrder.findOne({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vid", "brand", "model", "year"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("getOrderById error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  try {
    const whereClause = status ? { status } : {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await PurchaseOrder.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Vehicle,
              as: "vehicle",
              attributes: ["vid", "brand", "model", "year"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return res.status(200).json({
      orders,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      totalOrders: count,
    });
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, adminNotes } = req.body;

  const validStatuses = [
    "pending",
    "processing",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await PurchaseOrder.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updateData = { status };

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // Set timestamps based on status
    if (status === "processing" && !order.processedAt) {
      updateData.processedAt = new Date();
    } else if (status === "shipped" && !order.shippedAt) {
      updateData.shippedAt = new Date();
    } else if (status === "delivered" && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    await order.update(updateData);

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  validateCreditCard, // Export for testing
};
