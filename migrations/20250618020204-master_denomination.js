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
      CREATE TABLE master_denomination (
        md_id int NOT NULL AUTO_INCREMENT,
        md_code varchar(6) NOT NULL,
        md_description varchar(120) NOT NULL,
        md_value decimal(10,2) NOT NULL,
        md_status enum('ACTIVE','INACTIVE') NOT NULL,
        md_create_by varchar(300) NOT NULL,
        md_create_date varchar(20) NOT NULL,
        PRIMARY KEY (md_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('master_denomination')
  },
}
