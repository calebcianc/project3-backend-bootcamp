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
      timeOfDay: DataTypes.STRING,
      location: DataTypes.STRING,
      suggestedDuration: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      description: DataTypes.TEXT,
      activityOrder: DataTypes.FLOAT,
      photoUrl: DataTypes.TEXT,
      type: DataTypes.STRING,
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
