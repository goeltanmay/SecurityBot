const Promise = require('bluebird');
const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;

function installation_repositories(req, res) {

  switch(req.body.action) {
    case 'added':
      promises = []
      req.body.repositories_added.forEach( repository => {
        promises.push(Repo.create({
          username: req.body.installation.account.login,
          repo: repository.name,
          instance_url: 'skd',
        })
        .then(repo => {
          RepoEvent.create({
            type: 'installation_repositories',
            detail: repository.name,
            repoId: repo.id,
            current_commit: null,
            previous_commit: null,
          });
        }));
      });
      Promise.all(promises).then(() => res.status(201).send())
      .catch(error => res.status(400).send(error));
      break;
    case 'removed':
      promises = []
      req.body.repositories_removed.forEach( repository => {
        promises.push(Repo.destroy({
          where: {
            username: req.body.sender.login,
            repo: repository.name,
          }
        }))
      })
      Promise.all(promises).then(() => res.status(202).send())
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
          username: req.body.repository.owner.login,
          repo: req.body.repository.name
        }
      })
      .then(repo => {
        RepoEvent.create({
          type: 'pull_request',
          detail: req.body.number,
          repoId: repo.id,
          current_commit: req.body.pull_request.head.sha,
          previous_commit: req.body.pull_request.base.sha,
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

function push(req, res) {
  Repo.findOne({
    where: {
      username: req.body.repository.owner.name,
      repo: req.body.repository.name
    }
  })
  .then(repo => {
    RepoEvent.create({
      type: 'push',
      detail: req.body.after,
      repoId: repo.id,
      current_commit: req.body.after,
      previous_commit: req.body.before,
    })
    .then(repoEvent => res.status(201).send(repo))
    .catch(error => res.status(400).send(error));
  })
  .catch(error => res.status(400).send(error));
}

module.exports = {
  pull_request,
  installation_repositories,
  push,
}
