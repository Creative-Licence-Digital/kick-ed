'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var ENV = process.env.NODE_ENV || "development";
  var sequelize = new _sequelize2.default(config.database, config.username, config.password, config);
  var _db = {};

  _fs2.default.readdirSync(__dirname).filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js";
  }).forEach(function (file) {
    var model = sequelize.import(_path2.default.join(__dirname, file));
    _db[model.name] = model;
  });

  Object.keys(_db).forEach(function (modelName) {
    if ("associate" in _db[modelName]) {
      _db[modelName].associate(_db);
    }
  });

  _db.sequelize = sequelize;
  _db.Sequelize = _sequelize2.default;
  _db.sequelize.sync().then(function (res) {
    console.log("DB synchronized");
  }).catch(function (err) {
    console.error("Error while synchronizing the DB schemas", err);
  });
  return _db;
};