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
     CREATE TABLE sales_purchase_order (
      spo_reference_id varchar(300) DEFAULT NULL,
      spo_sales_id varchar(45) DEFAULT NULL,
      spo_branch_id varchar(45) DEFAULT NULL,
      spo_pos_id varchar(45) DEFAULT NULL
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

    await queryInterface.dropTable('sales_purchase_order')
  }
};
