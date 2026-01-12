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
      CREATE TABLE stock_adjustment_item (
  sai_id int NOT NULL AUTO_INCREMENT,
  sai_detailid int NOT NULL,
  sai_productid int NOT NULL,
  sai_quantity int NOT NULL,
  sai_stockafter int NOT NULL,
  PRIMARY KEY (sai_id),
  KEY sai_detailid (sai_detailid),
  KEY sai_productid (sai_productid),
  CONSTRAINT stock_adjustment_item_ibfk_1 FOREIGN KEY (sai_detailid) REFERENCES stock_adjustment_detail (sad_id),
  CONSTRAINT stock_adjustment_item_ibfk_2 FOREIGN KEY (sai_productid) REFERENCES master_product (mp_productid)
) ENGINE=InnoDB AUTO_INCREMENT=852 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('stock_adjustment_item')
  }
};
