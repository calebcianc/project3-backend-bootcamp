"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itineraries extends Model {
    static associate(models) {
      this.belongsToMany(models.users, { through: "user_itineraries" });
      this.hasMany(models.activities);
    }
  }
  Itineraries.init(
    {
      name: DataTypes.STRING,
      prompts: DataTypes.TEXT,
      is_public: DataTypes.BOOLEAN,
      max_pax: DataTypes.INTEGER,
      current_pax: DataTypes.INTEGER,
      gender_preference: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "itineraries",
      underscored: true,
    }
  );
  return Itineraries;
};
