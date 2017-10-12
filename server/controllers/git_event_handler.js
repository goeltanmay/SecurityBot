const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;

function installation_repositories(req, res) {
  switch(req.body.action) {
    case 'added':
      Repo.create({
        username: req.body.sender.login,
        repo: req.body.repositories_added.name,
        instance_url: 'skd',
      })
      .then(repo => {
        RepoEvent.create({
          type: 'installation_repositories',
          detail: req.body.repo,
          repoId: repo.id,
        })
        .then(repoEvent => res.status(201).send(repo))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
      break;
    case 'removed':
      Repo.destroy({
        where: {
          username: req.body.sender.login,
          repo: req.body.repositories_added.name,
        }
      })
      .then(repo => res.status(202).send(repo))
      .catch(error => res.status(400).send(error));
      break;
    default:
      res.status(200).send();
  }
}

function pull_request(req, res) {
  switch(req.body.action) {
    case 'opened':
    case 'edited':
      Repo.findOne({
        where: {
          username: req.body.pull_request.user.login,
          repo: req.body.repo.name
        }
      })
      .then(repo => {
        RepoEvent.create({
          type: 'pull_request',
          detail: req.body.number,
          repoId: repo.id,
        })
        .then(repoEvent => res.status(201).send(repo))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
      break;
    default:
      res.status(200).send();
  }
}

module.exports = {
  pull_request,
  installation_repositories,
}
