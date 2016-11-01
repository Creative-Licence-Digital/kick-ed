'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (sequelize, DataTypes) {
  var UserContentField = sequelize.define('UserContentField', {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    label: DataTypes.STRING,
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    position: DataTypes.INTEGER,
    binding: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return UserContentField;
};