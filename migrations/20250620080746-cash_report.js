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
      `CREATE TABLE cash_report (
        cr_report_id varchar(300) NOT NULL,
        cr_date varchar(300) NOT NULL,
        cr_shift varchar(300) NOT NULL,
        cr_pos varchar(300) NOT NULL,
        cr_cashier varchar(300) NOT NULL,
        cr_type varchar(300) NOT NULL,
        cr_status varchar(300) NOT NULL,
        PRIMARY KEY (cr_report_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('cash_report')
  },
}
