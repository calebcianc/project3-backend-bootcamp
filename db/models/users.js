"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      this.belongsToMany(models.itineraries, {
        through: "user_itineraries",
        onDelete: "CASCADE", // Cascade delete for the many-to-many relationship
        onUpdate: "CASCADE",
      });
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
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
