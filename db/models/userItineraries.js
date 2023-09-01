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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      itineraryId: {
        type: DataTypes.INTEGER,
        references: {
          model: "itineraries",
          key: "id",
        },
      },
      isCreator: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user_itineraries",
      underscored: true,
    }
  );
  return UserItineraries;
};
