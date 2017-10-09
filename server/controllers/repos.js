const Repo = require('../models').Repo;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Repo
      .create({
        username: req.body.username,
        repo: req.body.repo,
        instance_url: req.body.instance_url,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
  return Repo
    .all()
    .then(todos => res.status(200).send(todos))
    .catch(error => res.status(400).send(error));
  },
  
};
