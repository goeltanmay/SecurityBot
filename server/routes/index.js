const reposController = require('../controllers').repos;
const hooksController = require('../controllers').hooks;

module.exports = (app) => {
  app.get('/api', (req, res) => {
    res.status(200).send({
      message: 'Welcome to the Robocop API!',
    });
  });

  app.get('/setup', hooksController.setup);

  app.post('/register', hooksController.register);
  app.post('/githook', hooksController.githook);

  app.post('/api/repos', reposController.create);
  app.get('/api/repos', reposController.list)
  app.get('/api/repos/:username/:repo/event', reposController.getEvent)
};
