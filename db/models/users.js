"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsToMany(models.itineraries, {
        through: "user_itineraries",
        as: "user",
        foreignKey: "user_id",
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
