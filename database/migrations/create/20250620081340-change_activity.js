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
      CREATE TABLE change_activity (
        ca_id int NOT NULL AUTO_INCREMENT,
        ca_detail_id varchar(300) NOT NULL,
        ca_total_amount decimal(10,2) NOT NULL,
        ca_cash_tender decimal(10,2) NOT NULL,
        ca_change decimal(10,2) NOT NULL,
        PRIMARY KEY (ca_id),
        KEY ca_detail_id (ca_detail_id),
        CONSTRAINT change_activity_ibfk_1 FOREIGN KEY (ca_detail_id) REFERENCES sales_detail (st_detail_id)
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

    await queryInterface.dropTable('change_activity')
  }
};
