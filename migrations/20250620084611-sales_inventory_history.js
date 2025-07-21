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
      CREATE TABLE sales_inventory_history (
  sih_historyid int NOT NULL AUTO_INCREMENT,
  sih_detailid varchar(300) NOT NULL,
  sih_date varchar(20) NOT NULL,
  sih_productid int NOT NULL,
  sih_branch varchar(5) NOT NULL,
  sih_quantity int NOT NULL,
  PRIMARY KEY (sih_historyid),
  KEY sih_detailid (sih_detailid),
  KEY sih_productid (sih_productid),
  CONSTRAINT sales_inventory_history_ibfk_1 FOREIGN KEY (sih_detailid) REFERENCES sales_detail (st_detail_id),
  CONSTRAINT sales_inventory_history_ibfk_2 FOREIGN KEY (sih_productid) REFERENCES product_inventory (pi_productid)
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

    await queryInterface.dropTable('sales_inventory_history')
  }
};
