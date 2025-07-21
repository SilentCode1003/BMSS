'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.query(`
      CREATE TABLE production_logs (
        pl_logid int NOT NULL,
        pl_description longtext NOT NULL,
        pl_status varchar(20) NOT NULL,
        pl_date varchar(20) NOT NULL,
        PRIMARY KEY (pl_logid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_logs')
  }
};
