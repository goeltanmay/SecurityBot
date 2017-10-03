const Repo = require('../models').Repo;

module.exports = {
  create(req, res) {
    return Repo
      .create({
        user: req.body.user,
        repo: req.body.repo,
        instance_url: req.body.instance_url,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
};
