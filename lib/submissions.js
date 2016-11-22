'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _slides = require('./slides');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var models = (0, _models2.default)(config);

  // Returns an instance with default values 
  var defaultInstance = function defaultInstance() {
    return models.UserContent.build();
  };

  // List all instances for a certain query
  var list = function list(where) {
    return models.UserContent.findAll({
      where: Object.assign({}, where, { deletedAt: null }),
      include: [models.UserContentField]
    });
  };

  var allTemplates = list({ isTemplate: true });

  // Get a submission by uuid
  var getByUuid = function getByUuid(uuid) {
    return models.UserContent.findOne({
      where: { uuid: uuid },
      include: [models.UserContentField]
    });
  };

  // All submissions posted by an user
  var allContentForUser = function allContentForUser(user) {
    return models.UserContent.findAll({
      where: { user: user, deletedAt: null },
      include: [models.UserContentField]
    });
  };

  // Remove the fields which do not exist anymore
  var removeUnusedFields = function removeUnusedFields(submissionUuid, existingFieldUuids) {
    var where = { UserContentUuid: submissionUuid };
    if (existingFieldUuids.length > 0) {
      where.uuid = { $notIn: existingFieldUuids };
    }
    return models.UserContentField.destroy({ where: where });
  };

  // Update a User Content Field in the DB (Or creates it if needed)
  var updateField = function updateField(field) {
    if (!field.uuid) {
      field.uuid = _uuid2.default.v4();
    }
    return models.UserContentField.upsert(field);
  };

  var remove = function remove(uuid) {
    return models.UserContent.destroy({ where: { uuid: uuid } });
  };

  var bindToLessonTemplate = function bindToLessonTemplate(_ref) {
    var uuid = _ref.uuid,
        lesson_template = _ref.lesson_template,
        slides = _ref.slides;

    return models.UserContent.update({ slides: slides, lesson_template: lesson_template }, { where: { uuid: uuid } });
  };

  var updateBindings = function updateBindings(updates) {
    var promises = updates.map(updateField);
    return Promise.all(promises);
  };

  var generateSlide = function generateSlide(uc) {
    return new Promise(function (resolve, reject) {
      getByUuid(uc.uuid).then(function (ucWithSlides) {
        var newSlides = (0, _slides.generate)(ucWithSlides.slides, ucWithSlides.UserContentFields);
        return ucWithSlides.update({ slides: JSON.stringify(newSlides) });
      }).catch(function (e) {
        console.error("ERROR", e);
        reject(e);
      });
    });
  };

  var updateAndGenerateSlides = function updateAndGenerateSlides(uc) {
    return update(uc).then(generateSlide(uc));
  };

  // Update or create a submission
  var update = function update(uc) {
    return new Promise(function (resolve, reject) {

      // Link the fields to the user content, and stores their position
      var _arr = ["opened", "submitted", "requested", "deleted"];
      for (var _i = 0; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        prop += "At";
        if (uc[prop]) {
          uc[prop] = new Date(uc[prop]);
        } else {
          uc[prop] = null;
        }
      }

      if (!uc.uuid || uc.uuid === "new") {
        uc.uuid = _uuid2.default.v4();
      }

      var fields = (uc.fields || []).map(function (f, i) {
        f.UserContentUuid = uc.uuid;
        f.position = f.position ? parseInt(f.position, 10) : i + 1;
        return f;
      });

      var remainingUuids = fields.map(function (f) {
        return f.uuid;
      }).filter(function (a) {
        return a;
      });

      delete uc.fields;
      var createUC = models.UserContent.upsert(uc);

      createUC.then(function () {
        var updateAllFields = fields.map(updateField);
        Promise.all(updateAllFields).then(removeUnusedFields(uc.uuid, remainingUuids)).then(function () {
          return resolve(Object.assign({}, uc, { fields: fields, _id: uc.uuid }));
        }).catch(reject);
      }).catch(reject);
    });
  };

  return { list: list,
    getByUuid: getByUuid,
    updateField: updateField,
    update: update,
    updateAndGenerateSlides: updateAndGenerateSlides,
    remove: remove,
    defaultInstance: defaultInstance,
    allContentForUser: allContentForUser,
    allTemplates: allTemplates,
    bindToLessonTemplate: bindToLessonTemplate,
    updateBindings: updateBindings };
};