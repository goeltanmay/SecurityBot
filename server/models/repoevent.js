module.exports = (sequelize, DataTypes) => {
 const RepoEvent = sequelize.define('RepoEvent', {
   type: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   detail: {
     type: DataTypes.STRING,
     defaultValue: false,
   },
 });

 RepoEvent.associate = (models) => {
   RepoEvent.belongsTo(models.Repo, {
     foreignKey: 'repoId',
     onDelete: 'CASCADE',
   });
 };

 return RepoEvent;
};
