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
      CREATE TABLE master_location (
        ml_locationid int NOT NULL AUTO_INCREMENT,
        ml_locationname varchar(300) NOT NULL,
        ml_status varchar(20) NOT NULL,
        ml_createdby varchar(300) NOT NULL,
        ml_createddate varchar(20) NOT NULL,
        PRIMARY KEY (ml_locationid)
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

    await queryInterface.dropTable('master_location')
  },
}
