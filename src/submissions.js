import Models from './models'

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

  // Update a User Content Field in the DB (Or creates it if needed)
   const updateField = (field) => {
    return models.UserContentField.upsert(field)
  }

  // Update or create a submission
  const update = (uc) => new Promise((resolve, reject) => {
    // Link the fields to the user content, and stores their position
    if (uc.openedAt) {
      uc.openedAt = new Date(uc.openedAt);
    }

    if (uc.submittedAt) {
      uc.submittedAt = new Date(uc.submittedAt);
    }
    const fields = (uc.fields || []).map((f, i) => {
      f.UserContentUuid = uc.uuid; 
      f.position = i + 1;
      return f;
    });
    delete uc.fields;
    const createUC        = models.UserContent.upsert(uc);

    createUC.then(() => {
      const updateAllFields = fields.map(updateField);
      Promise.all(updateAllFields)
             .then(() => resolve())
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
