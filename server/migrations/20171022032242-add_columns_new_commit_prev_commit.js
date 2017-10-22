'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn(
      'RepoEvents',
      'current_commit',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
    queryInterface.addColumn(
      'RepoEvents',
      'previous_commit',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('RepoEvents','current_commit');
    queryInterface.removeColumn('RepoEvents','previous_commit');
  }
};
