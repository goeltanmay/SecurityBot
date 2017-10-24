const Repo = require('../models').Repo;
const RepoEvent = require('../models').RepoEvent;

module.exports = {
 create(req, res) {
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
   Repo.findOne({
     where:{
       username: req.params.username,
       repo: req.params.repo,
     },
     include: [{
       model: RepoEvent,
       as: 'repoEvents',
     }],
   }).then( function (repo) {
     if (!repo){
       res.status(404).send();
     }
     else if (repo.repoEvents.length == 0) {
       res.status(204).send();
     }
     else {
       res.status(200).send(repo.repoEvents[0]);
       RepoEvent.destroy({
         where: {
           id : repo.repoEvents[0].id
         }
       });
     }
   })
   .catch(error => res.status(400).send(error))
 }
};
