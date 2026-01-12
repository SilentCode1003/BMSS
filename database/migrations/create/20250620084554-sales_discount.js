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
      CREATE TABLE sales_discount (
        sd_id int NOT NULL AUTO_INCREMENT,
        sd_detailid varchar(300) NOT NULL,
        sd_discountid int NOT NULL,
        sd_customerinfo text NOT NULL,
        sd_amount decimal(10,2) NOT NULL,
        PRIMARY KEY (sd_id),
        KEY sd_discountid (sd_discountid),
        CONSTRAINT sales_discount_ibfk_2 FOREIGN KEY (sd_discountid) REFERENCES discounts_details (dd_discountid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('sales_discount')
  }
};
