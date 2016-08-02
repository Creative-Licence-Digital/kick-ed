import Models from './models'


export default (app, config) => {
  const models = Models(config);

  // Update a User Content Field in the DB (Or creates it if needed)
  const updateField = (field) => {
    return models.UserContentField.upsert(field)
  }

  // Update User Content in the DB 
  // Updates also all the related fields
  const updateUC = (uc) => new Promise((resolve, reject) => {
    // Link the fields to the user content, and stores their position
    console.error("UC", uc.openedAt, typeof uc.openedAt);
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

  const allContentForUser = (user) => models.UserContent.findAll({
    where:   { user },
    include: [ models.UserContentField ]
  });

  app.post("/api/sync", (req, res, next) => {
    const user = req.body["user_data"].userData._id.toString();
    const ucs  = (req.body["user_content"] || []).map(uc => {
      uc.user = user; 
      return uc;
    });

    Promise.all(ucs.map(updateUC))
           .then(() => {
              allContentForUser(user).then((ucs) => {
                req.body.user_content = ucs.map(uc => uc.toJSON());
                next();
              });
            })
           .catch((e) => {
              console.error(e) 
           });
  });

}
