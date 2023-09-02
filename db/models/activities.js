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
      date: DataTypes.DATE,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      activityOrder: DataTypes.INTEGER,
      timeOfDay: DataTypes.STRING,
      suggestedDuration: DataTypes.STRING,
      location: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      photoUrl: DataTypes.TEXT,
      itineraryId: {
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
