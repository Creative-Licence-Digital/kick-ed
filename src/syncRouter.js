import Submissions from './submissions'

export default (app, config) => {
  const submissions = Submissions(config);

  const transform = (uc) => {
    let d = Object.assign({}, uc.toJSON())
    delete d.slides
    return d;
  }

  app.post("/api/sync", (req, res, next) => {
    const user = req.body["user_data"].userData._id.toString();
    const ucs  = (req.body["user_content"] || []).map(uc => {
      uc.user = user; 
      return uc;
    });

    Promise.all(ucs.map(submissions.updateAndGenerateSlides))
           .then(() => {
              submissions.allContentForUser(user).then((ucs) => {
                req.body.user_content = ucs.map(transform);

                submissions.allTemplates.then((ts) => {
                  req.body.uctemplates = ts.map(function(t) { return Object.assign({}, t.toJSON()); });
                  next();
                });
              });
            })
           .catch((e) => console.error(e));
  });

}
