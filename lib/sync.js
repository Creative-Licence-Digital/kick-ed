"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app, config) {
  var models = (0, _models2.default)(config);

  // Update a User Content Field in the DB (Or creates it if needed)
  var updateField = function updateField(field) {
    console.log("CREATING", field);
    return models.UserContentField.upsert(field);
  };

  // Update User Content in the DB 
  // Updates also all the related fields
  var updateUC = function updateUC(uc) {
    return new Promise(function (resolve, reject) {
      // Link the fields to the user content, and stores their position
      var fields = (uc.fields || []).map(function (f, i) {
        f.UserContentUuid = uc.uuid;
        f.position = i + 1;
        return f;
      });
      delete uc.fields;
      console.log("CREATING SUBMISSIOn", uc);
      var createUC = models.UserContent.upsert(uc);

      createUC.then(function () {
        var updateAllFields = fields.map(updateField);
        Promise.all(updateAllFields).then(function () {
          return resolve();
        }).catch(reject);
      }).catch(reject);
    });
  };

  var allContentForUser = function allContentForUser(user) {
    return models.UserContent.findAll({
      where: { user: user },
      include: [models.UserContentField]
    });
  };

  app.post("/api/sync", function (req, res, next) {
    var user = req.body["user_data"].userData._id.toString();
    var ucs = (req.body["user_content"] || []).map(function (uc) {
      uc.user = user;
      return uc;
    });

    Promise.all(ucs.map(updateUC)).then(function () {
      allContentForUser(user).then(function (ucs) {
        req.body.user_content = ucs.map(function (uc) {
          return uc.toJSON();
        });
        next();
      });
    }).catch(function (e) {
      console.error(e);
    });
  });

  app.post("/api/content", function (req, res) {
    var content = req.body("content");
    res.send({ content: {} });
  });

  app.get("/api/content", function (req, res) {
    var course = req.query["course"];
    var lesson = req.query["lesson"];
    var include = [models.UserContentField];
    var where = {};
    if (course) where.course = course;
    if (lesson) where.lesson = lesson;

    models.UserContent.findAll({ where: where, include: include }).then(function (elements) {
      res.send({ elements: elements });
    });
  });
};