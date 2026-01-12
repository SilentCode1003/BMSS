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
      CREATE TABLE master_category (
        mc_categorycode int NOT NULL AUTO_INCREMENT,
        mc_categoryname varchar(300) NOT NULL,
        mc_status varchar(300) NOT NULL,
        mc_createdby varchar(300) NOT NULL,
        mc_createddate varchar(20) NOT NULL,
        mc_is_display tinyint DEFAULT NULL,
        PRIMARY KEY (mc_categorycode)
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

    await queryInterface.dropTable('master_category')
  },
}
