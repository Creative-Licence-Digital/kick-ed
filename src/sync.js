import Models from './models'

export default (app, config) => {
  const models = Models(config);

  app.post("/api/content/sync", (req, res) => {

  });

  app.post("/api/content", (req, res) => {
    const content = req.param("content");
      
  });

  app.get("/api/content", (req, res) => {
    const course  = req.param("course");
    const lesson  = req.param("lesson");
    const include = [ models.UserContentField ];
    let   where   = {};
    if (course) where.course = course;
    if (lesson) where.lesson = lesson;

    models.UserContent.findAll({ where, include }).then(elements => {
      res.send({ elements });
    });
  }); 
}
