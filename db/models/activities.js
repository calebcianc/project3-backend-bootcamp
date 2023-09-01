"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activities extends Model {
    static associate(models) {
      this.belongsTo(models.itineraries, {
        onDelete: "CASCADE", // Cascade delete for the many-to-many relationship
        onUpdate: "CASCADE",
      });
    }
  }
  Activities.init(
    {
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      time_of_day: DataTypes.STRING,
      location: DataTypes.STRING,
      suggested_duration: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      activity_order: DataTypes.INTEGER,
      photo_url: DataTypes.TEXT,
      type: DataTypes.STRING,
      itinerary_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "itineraries",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "activities",
      underscored: true,
    }
  );
  return Activities;
};
