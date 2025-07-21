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

    await queryInterface.sequelize.query(`
      CREATE TABLE package (
        p_id int NOT NULL AUTO_INCREMENT,
        p_name varchar(300) NOT NULL,
        p_details longtext NOT NULL,
        p_price decimal(10,2) NOT NULL,
        p_status varchar(20) NOT NULL,
        p_createdby varchar(300) NOT NULL,
        p_createddate varchar(20) NOT NULL,
        PRIMARY KEY (p_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('package')
  },
}
