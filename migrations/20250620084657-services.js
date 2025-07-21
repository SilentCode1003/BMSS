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
      CREATE TABLE services (
  s_id int NOT NULL AUTO_INCREMENT,
  s_name varchar(300) NOT NULL,
  s_price decimal(10,2) NOT NULL,
  s_status varchar(20) NOT NULL,
  s_createdby varchar(300) NOT NULL,
  s_createddate varchar(20) NOT NULL,
  PRIMARY KEY (s_id)
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

    await queryInterface.dropTable('services')
  }
};
