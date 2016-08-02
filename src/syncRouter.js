import Submissions from './submissions'

export default (app, config) => {
  const submissions = Submissions(config);

  app.post("/api/sync", (req, res, next) => {
    const user = req.body["user_data"].userData._id.toString();
    const ucs  = (req.body["user_content"] || []).map(uc => {
      uc.user = user; 
      return uc;
    });

    Promise.all(ucs.map(submissions.update))
           .then(() => {
              submissions.allContentForUser(user).then((ucs) => {
                req.body.user_content = ucs.map(uc => uc.toJSON());
                next();
              });
            })
           .catch((e) => console.error(e));
  });

}
