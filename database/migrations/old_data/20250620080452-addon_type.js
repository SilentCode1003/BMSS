'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.query(
      `CREATE TABLE addon_type (
        at_id int NOT NULL AUTO_INCREMENT,
        at_name varchar(300) NOT NULL,
        at_status varchar(20) NOT NULL,
        at_createdby varchar(300) NOT NULL,
        at_createddate varchar(20) NOT NULL,
        PRIMARY KEY (at_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('addon_type')
  },
}
