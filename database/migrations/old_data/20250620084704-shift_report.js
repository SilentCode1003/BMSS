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
      CREATE TABLE shift_report (
  sr_date varchar(20) NOT NULL,
  sr_pos varchar(4) NOT NULL,
  sr_shift varchar(2) NOT NULL,
  sr_cashier varchar(300) NOT NULL,
  sr_floating varchar(300) DEFAULT NULL,
  sr_cash_float varchar(300) DEFAULT NULL,
  sr_sales_beginning varchar(300) DEFAULT NULL,
  sr_sales_ending varchar(300) DEFAULT NULL,
  sr_total_sales varchar(300) DEFAULT NULL,
  sr_receipt_beginning varchar(300) DEFAULT NULL,
  sr_receipt_ending varchar(300) DEFAULT NULL,
  sr_status varchar(300) DEFAULT NULL,
  sr_approvedby varchar(300) DEFAULT NULL,
  sr_approveddate varchar(300) DEFAULT NULL,
  PRIMARY KEY (sr_date,sr_pos,sr_shift,sr_cashier)
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

    await queryInterface.dropTable('shift_report')
  }
};
