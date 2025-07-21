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
      CREATE TABLE sales_item (
        si_detail_id varchar(300) NOT NULL,
        si_date varchar(20) NOT NULL,
        si_item varchar(300) NOT NULL,
        si_price varchar(300) NOT NULL,
        si_quantity varchar(300) NOT NULL,
        si_total varchar(300) NOT NULL
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

    await queryInterface.dropTable('sales_item')
  },
}
