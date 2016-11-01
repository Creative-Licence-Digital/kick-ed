"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _submissions = require("./submissions");

var _submissions2 = _interopRequireDefault(_submissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app, config) {
  var submissions = (0, _submissions2.default)(config);

  var transform = function transform(uc) {
    var d = Object.assign({}, uc.toJSON());
    delete d.slides;
    return d;
  };

  app.post("/api/sync", function (req, res, next) {
    var user = req.body["user_data"].userData._id.toString();
    var ucs = (req.body["user_content"] || []).map(function (uc) {
      uc.user = user;
      return uc;
    });

    Promise.all(ucs.map(submissions.updateAndGenerateSlides)).then(function () {
      submissions.allContentForUser(user).then(function (ucs) {
        req.body.user_content = ucs.map(transform);
        next();
      });
    }).catch(function (e) {
      return console.error(e);
    });
  });
};