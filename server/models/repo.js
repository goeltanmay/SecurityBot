module.exports = (sequelize, DataTypes) => {
  const Repo = sequelize.define('Repo', {
    username: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    repo: DataTypes.STRING,
    instance_url: DataTypes.STRING
  });

  Repo.associate = (models) => {
   Repo.hasMany(models.RepoEvent, {
     foreignKey: 'repoId',
     as: 'repoEvents',
   });
 };
  return Repo;
};
