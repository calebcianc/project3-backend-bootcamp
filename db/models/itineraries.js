"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itineraries extends Model {
    static associate(models) {
      this.belongsToMany(models.users, {
        through: "user_itineraries",
        onDelete: "CASCADE", // Cascade delete for the many-to-many relationship
        onUpdate: "CASCADE",
      });
      this.hasMany(models.activities, {
        onDelete: "CASCADE", // Cascade delete for the hasMany relationship
        onUpdate: "CASCADE",
      });
    }
  }
  Itineraries.init(
    {
      name: DataTypes.STRING,
      prompts: DataTypes.TEXT,
      isPublic: DataTypes.BOOLEAN,
      maxPax: DataTypes.INTEGER,
      genderPreference: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itineraries",
      underscored: true,
    }
  );
  return Itineraries;
};
