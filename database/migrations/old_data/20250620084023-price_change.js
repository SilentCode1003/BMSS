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
      CREATE TABLE price_change (
        pc_price_change_id varchar(300) NOT NULL,
        pc_product_id varchar(300) NOT NULL,
        pc_price varchar(300) NOT NULL,
        pc_status varchar(300) NOT NULL,
        pc_createdby varchar(300) NOT NULL,
        pc_createddate varchar(300) NOT NULL,
        PRIMARY KEY (pc_price_change_id)
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

    await queryInterface.dropTable('price_change')
  }
};
