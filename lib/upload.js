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
    if (file.mimetype.match(/^video/)) {
      done(null, 'assets/videos/');
    } else if (file.mimetype.match(/^image/)) {
      done(null, 'assets/images/');
    } else {
      done(new Error("not an asset you can upload"));
    }
  },
  filename: function filename(req, file, n) {
    var extension = "";
    if (file.mimetype.match(/^video/)) {
      extension = 'mp4';
    } else if (file.mimetype.match(/^image/)) {
      extension = 'jpg';
    }
    n(null, Date.now() + "." + extension);
  }
});

var upload = (0, _multer2.default)({ storage: storage });

exports.default = function (app) {
  app.post("/api/content/upload", upload.single('file'), function (req, res, next) {
    res.send({ url: req.file.s3.Location });
  });
};