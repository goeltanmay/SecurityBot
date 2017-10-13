const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;

module.exports = {
  create(req, res) {
    // console.log(req.body);
    return Repo
      .create({
        username: req.body.username,
        repo: req.body.repo,
        instance_url: req.body.instance_url,
      })
      .then(repo => res.status(201).send(repo))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
  return Repo
  .findAll({
    include: [{
      model: RepoEvent,
      as: 'repoEvents',
    }],
  })
  .then(repos => res.status(200).send(repos))
  .catch(error => res.status(400).send(error))
  },

  getEvent(req, res) {
    var events = Repo.findOne({
      where:{
        username: req.get('username'),
        repo: req.get('repo'),
      }
    }).then( function (repo) {
      if (!repo){
        res.status(204).send();
      }
      res.status(200).send(repo.repoEvents[0]);
    })
    .catch(error => res.status(400).send(error))
  }
};
