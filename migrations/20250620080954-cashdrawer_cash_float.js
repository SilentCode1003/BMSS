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
      `CREATE TABLE cashdrawer_cash_float (
        ccf_id int NOT NULL AUTO_INCREMENT,
        ccf_date varchar(20) NOT NULL,
        ccf_branch_id varchar(4) NOT NULL,
        ccf_pos varchar(4) NOT NULL,
        ccf_shift varchar(2) NOT NULL,
        ccf_cashier varchar(300) NOT NULL,
        ccf_cash_float decimal(10,2) NOT NULL,
        ccf_denomination longtext NOT NULL,
        PRIMARY KEY (ccf_id)
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

    await queryInterface.dropTable('cashdrawer_cash_float')
  },
}
