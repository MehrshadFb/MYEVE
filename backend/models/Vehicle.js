const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const Vehicle = sequelize.define("Vehicle", {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    range: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Range in kilometers",
      validate: {
        min: 0,
      },
    },
    horsepower: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL or path to vehicle image",
    },
  });

  return Vehicle;
}; 