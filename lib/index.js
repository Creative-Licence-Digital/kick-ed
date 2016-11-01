'use strict';

Object.defineProperty(exports, "__esModule", {
         value: true
});
exports.submissions = exports.syncRouter = exports.uploadRouter = undefined;

var _uploadRouter = require('./uploadRouter');

var _uploadRouter2 = _interopRequireDefault(_uploadRouter);

var _syncRouter = require('./syncRouter');

var _syncRouter2 = _interopRequireDefault(_syncRouter);

var _submissions = require('./submissions');

var _submissions2 = _interopRequireDefault(_submissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.uploadRouter = _uploadRouter2.default;
exports.syncRouter = _syncRouter2.default;
exports.submissions = _submissions2.default;