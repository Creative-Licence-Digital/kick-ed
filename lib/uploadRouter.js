'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _multerStorageS = require('multer-storage-s3');

var _multerStorageS2 = _interopRequireDefault(_multerStorageS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storage = (0, _multerStorageS2.default)({
  bucket: 'ed-content-creator-assets',
  destination: function destination(req, file, done) {
    var isVideo = req.url.match(/video$/);
    var folder = "assets/" + (isVideo ? "videos/" : "images/");
    done(null, folder);
  },
  filename: function filename(req, file, n) {
    var isVideo = req.url.match(/video$/);
    var extension = isVideo ? "mov" : "jpg";
    var result = Date.now() + "." + extension;
    console.error("FILENAME", result);
    n(null, result);
  }
});

var upload = (0, _multer2.default)({ storage: storage });

exports.default = function (app) {
  app.post("/api/content/upload/:type", upload.single('file'), function (req, res, next) {
    res.send({ url: req.file.s3.Location });
  });
};