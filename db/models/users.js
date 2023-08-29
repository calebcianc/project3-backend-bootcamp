"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // belongsToMany is for the M-M association to query related itnerary instances
      this.belongsToMany(models.itineraries, {
        through: "user_itineraries",
        as: "owner",
        foreignKey: "ownerId",
      });
      this.belongsToMany(models.itineraries, {
        through: "user_itineraries",
        as: "guest",
        foreignKey: "guestId",
      });
    }
  }
  Users.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email_address: DataTypes.STRING,
      gender: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
      underscored: true,
    }
  );
  return Users;
};
