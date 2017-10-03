module.exports = (sequelize, DataTypes) => {
  const Repo = sequelize.define('Repo', {
    username: {
      type : DataTypes.STRING,
      allowNull: false,
    },
    repo: DataTypes.STRING,
    instance_url: DataTypes.STRING
  });
  // {
  //   classMethods: {
  //     associate: function(models) {
  //       // associations can be defined here
  //     }
  //   }
  // });
  return Repo;
};
