"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserItineraries extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        onDelete: "CASCADE", // Cascade delete for the many-to-many relationship
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.itineraries, {
        onDelete: "CASCADE", // Cascade delete for the many-to-many relationship
        onUpdate: "CASCADE",
      });
    }
  }
  UserItineraries.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      itinerary_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "personalities",
          key: "id",
        },
      },
      is_creator: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user_itineraries",
      underscored: true,
    }
  );
  return UserItineraries;
};
