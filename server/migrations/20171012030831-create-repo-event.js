'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('RepoEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      repo_id: {
       type: Sequelize.INTEGER,
       onDelete: ‘CASCADE’,
       references: {
         model: ‘Repos’,
         key: ‘id’,
         as: ‘repo_id’,
       },
     },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('RepoEvents');
  }
};
