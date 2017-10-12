const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;

function installation_repositories(req, res) {
    Repo
      .create({
        username: req.body.sender.login,
        repo: req.body.repositories_added.name,
        instance_url: "skd",
      })
      .then(repo => {
        console.log("here");
        console.log(req.body);
        RepoEvent.create({
            type: "installation_repositories",
            detail: req.body.repo,
            repoId: repo.id,
        })
        .then(repoEvent => res.status(201).send(repo))
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
      // .catch(error => res.status(400).send(error));
}

function pull_request(req, res) {
    // do your stuff here

}

module.exports = {
  pull_request,
  installation_repositories,
}
