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
      `
      CREATE TABLE master_access_type (
        mat_accesscode int NOT NULL AUTO_INCREMENT,
        mat_accessname varchar(300) NOT NULL,
        mat_status varchar(300) NOT NULL,
        mat_createdby varchar(300) NOT NULL,
        mat_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mat_accesscode)
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
    await queryInterface.dropTable('master_access_type')
  },
}
