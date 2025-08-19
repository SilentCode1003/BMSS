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
       CREATE TABLE access_route (
          ar_id int NOT NULL AUTO_INCREMENT,
          ar_access_id int NOT NULL,
          ar_route_id int NOT NULL,
          ar_access_type enum('full','read','edit','no access') NOT NULL,
          ar_status enum('active','inactive') NOT NULL,
          ar_create_at varchar(20) NOT NULL,
          ar_create_by varchar(300) NOT NULL,
          PRIMARY KEY (ar_id),
          KEY access_route_fk1_idx (ar_access_id),
          CONSTRAINT access_route_fk1 FOREIGN KEY (ar_access_id) REFERENCES salesinventory.master_access_type (mat_accesscode)
        ) ENGINE=InnoDB AUTO_INCREMENT=615 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('access_route')
  }
};
