const reposController = require('../controllers').repos;

module.exports = (app) => {
  app.get('/api', (req, res) => {
    console.log(req.query.installation_id);
    res.status(200).send({
      message: 'Welcome to the Todos API!',
    });
  });

  app.post('/api', (req, res) => {
    console.log(req);
    res.status(200).send({
      message: 'Welcome to the Todos API!',
    });
  });

  app.post('/api/repos', reposController.create);
  app.get('/api/repos', reposController.list)
};
