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
      CREATE TABLE transfer_order_items (
  toi_itemid int NOT NULL AUTO_INCREMENT,
  toi_transferid int NOT NULL,
  toi_productid int NOT NULL,
  toi_quantity int NOT NULL,
  toi_destinationStocks int NOT NULL,
  PRIMARY KEY (toi_itemid),
  KEY toi_transferid (toi_transferid),
  KEY toi_productid (toi_productid),
  CONSTRAINT transfer_order_items_ibfk_1 FOREIGN KEY (toi_transferid) REFERENCES transfer_orders (to_transferid),
  CONSTRAINT transfer_order_items_ibfk_2 FOREIGN KEY (toi_productid) REFERENCES master_product (mp_productid)
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

    await queryInterface.dropTable('transfer_order_items')
  }
};
