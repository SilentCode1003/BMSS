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

    await queryInterface.sequelize.query(
      `
      CREATE TABLE addon (
        a_id int NOT NULL AUTO_INCREMENT,
        a_name varchar(300) NOT NULL,
        a_type int NOT NULL,
        a_price decimal(10,0) NOT NULL,
        a_isproduct tinyint(1) NOT NULL,
        a_status varchar(20) NOT NULL,
        a_createdby varchar(300) NOT NULL,
        a_createddate varchar(20) NOT NULL,
        PRIMARY KEY (a_id),
        KEY a_type (a_type),
        CONSTRAINT addon_ibfk_1 FOREIGN KEY (a_type) REFERENCES addon_type (at_id)
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

    await queryInterface.dropTable('addon')
  }
};
