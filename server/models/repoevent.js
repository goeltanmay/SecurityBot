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
   previous_commit: {
     type: DataTypes.STRING,
     defaultValue: false,
   },
   current_commit: {
     type : DataTypes.STRING,
     defaultValue: false,
   }
 });

 RepoEvent.associate = (models) => {
   RepoEvent.belongsTo(models.Repo, {
     foreignKey: 'repoId',
     onDelete: 'CASCADE',
   });
 };

 return RepoEvent;
};
