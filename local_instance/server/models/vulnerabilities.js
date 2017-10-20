'use strict';
module.exports = (sequelize, DataTypes) => {
  var vulnerabilities = sequelize.define('vulnerabilities', {
    curr_hash: DataTypes.STRING,
    prev_hash: DataTypes.STRING,
    zap_result: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return vulnerabilities;
};
