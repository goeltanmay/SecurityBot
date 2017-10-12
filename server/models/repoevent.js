module.exports = (sequelize, DataTypes) => {
 const RepoEvent = sequelize.define(‘RepoEvent’, {
   type: {
     type: DataTypes.STRING,
     allowNull: false,
   },
   detail: {
     type: DataTypes.Text,
     defaultValue: false,
   },
 });

 RepoEvent.associate = (models) => {
   RepoEvent.belongsTo(models.Repo, {
     foreignKey: ‘repo_id’,
     onDelete: ‘CASCADE’,
   });
 };

 return RepoEvent;
};
