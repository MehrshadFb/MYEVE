const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const PurchaseOrder = sequelize.define("PurchaseOrder", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    // Billing Information
    billingFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    billingPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingStreet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingProvince: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingZip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Shipping Information
    shippingFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingStreet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingProvince: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shippingZip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Payment Information (encrypted/hashed)
    cardType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardLastFour: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 4],
      },
    },
    // Admin notes
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return PurchaseOrder;
};
