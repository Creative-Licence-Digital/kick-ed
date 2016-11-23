"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var applyBindingValueSlide = function applyBindingValueSlide(slide, bindings, value) {
  var newSlide = Object.assign({}, slide);

  if (bindings.length == 0) {
    return newSlide;
  } else {
    var newBindings = bindings;
    var key = newBindings.shift();
    var isArray = key.match(/\[/);
    if (isArray) {
      var indexKey = parseInt(key.match(/\d+/)[0], 10);
      var actualKey = key.replace(/\[\d+\]/, "");
      if (!newSlide[actualKey]) {
        newSlide[actualKey] = [];
      }
      var val = bindings.length === 0 ? value : applyBindingValueSlide(newSlide[actualKey][indexKey], newBindings, value);
      newSlide[actualKey][indexKey] = val;
    } else {
      newSlide[key] = bindings.length === 0 ? value : applyBindingValueSlide(newSlide[key], newBindings, value);
    }
    return newSlide;
  }
};

var applyBindingValue = function applyBindingValue(slides, binding, value) {
  var parts = binding.split(/\./);
  var slidePart = parts.shift();
  var index = parseInt(slidePart.match(/\d+/)[0], 10);

  var slide = slides[index];

  var newSlides = slides;
  parts.shift();

  if (slide && slide.data && newSlides[index] && newSlides[index].data) {
    newSlides[index].data = applyBindingValueSlide(slide.data, parts, value);
  }

  return newSlides;
};

var generate = exports.generate = function generate(slides, fields) {
  var newSlides = Object.assign({}, JSON.parse(slides));
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;
      var binding = field.binding,
          value = field.value;

      newSlides = applyBindingValue(newSlides, binding, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return newSlides;
};