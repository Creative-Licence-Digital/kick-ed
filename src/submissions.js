import Models from './models'
import uuid   from 'uuid'

export default (config) => {
  const models  = Models(config);

  // Returns an instance with default values 
  const defaultInstance = () => models.UserContent.build();

  // List all instances for a certain query
  const list = (where) => {
    return models.UserContent.findAll({
      where:   where,
      include: [ models.UserContentField ]
    });
  }

  // Get a submission by uuid
  const getByUuid = (uuid) => {
    return models.UserContent.findOne({
      where:   { uuid },
      include: [ models.UserContentField ]
    });
  }

  // All submissions posted by an user
  const allContentForUser = (user) => models.UserContent.findAll({
    where:   { user },
    include: [ models.UserContentField ]
  });

  // Remove the fields which do not exist anymore
  const removeUnusedFields = (submissionUuid, existingFieldUuids) => { 
    let where = { UserContentUuid: submissionUuid };
    if (existingFieldUuids.length > 0) {
      where.uuid = { $notIn: existingFieldUuids };
    }
    return models.UserContentField.destroy({ where });
  }

  // Update a User Content Field in the DB (Or creates it if needed)
  const updateField = (field) => {
    if (!field.uuid) {
      field.uuid = uuid.v4();
    }
    return models.UserContentField.upsert(field)
  }

  // Update or create a submission
  const update = (uc) => new Promise((resolve, reject) => {
    // Link the fields to the user content, and stores their position
    for (let prop of [ "opened", "submitted", "requested" ]) {
      prop += "at";
      if (uc[prop]) uc[prop] = new Date(uc[prop]);
    }

    if (!uc.uuid || uc.uuid === "new") {
      uc.uuid = uuid.v4();
    }

    const fields = (uc.fields || []).map((f, i) => {
      f.UserContentUuid = uc.uuid; 
      f.position = i + 1;
      return f;
    });

    const remainingUuids = fields
      .map(f => f.uuid)
      .filter(a => a);

    delete uc.fields;
    const createUC        = models.UserContent.upsert(uc);

    createUC.then(() => {
      const updateAllFields = fields.map(updateField);
      Promise.all(updateAllFields)
             .then(removeUnusedFields(uc.uuid, remainingUuids))
             .then(() => resolve(Object.assign({}, uc, { fields, _id: uc.uuid })))
             .catch(reject);

    }).catch(reject);
  });


  return { list, 
           getByUuid, 
           updateField, 
           update, 
           defaultInstance,
           allContentForUser };
}
