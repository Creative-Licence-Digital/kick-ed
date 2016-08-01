import Models from './models'


export default (app, config) => {
  const models = Models(config);

  // Update a User Content Field in the DB (Or creates it if needed)
  const updateField = (field) => models.UserContentField.upsert(field)

  // Update User Content in the DB 
  // Updates also all the related fields
  const updateUC = (uc) => new Promise((resolve, reject) => {
    // Link the fields to the user content, and stores their position
    const fields = (uc.fields || []).map((f, i) => {
      f.UserContentUuid = uc.uuid; 
      f.position = i + 1;
      return f;
    });
    const updateAllFields = fields.map(updateField);
    delete uc.fields;
    const createUC        = models.UserContent.upsert(uc);

    createUC.then(() => {

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

  app.post("/api/content", (req, res) => {
    const content = req.body("content");
    res.send({ content: {} });
  });

  app.get("/api/content", (req, res) => {
    const course  = req.query["course"];
    const lesson  = req.query["lesson"];
    const include = [ models.UserContentField ];
    var   where   = {};
    if (course) where.course = course;
    if (lesson) where.lesson = lesson;

    models.UserContent.findAll({ where, include }).then(elements => {
      res.send({ elements });
    });
  }); 
}
