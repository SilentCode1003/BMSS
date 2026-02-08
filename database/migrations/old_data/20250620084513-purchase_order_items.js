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
      CREATE TABLE purchase_order_items (
        poi_productid int NOT NULL AUTO_INCREMENT,
        poi_orderid int NOT NULL,
        poi_description varchar(100) NOT NULL,
        poi_quantity int NOT NULL,
        poi_unitprice decimal(10,2) NOT NULL,
        poi_totalprice decimal(10,2) NOT NULL,
        PRIMARY KEY (poi_productid),
        KEY poi_orderid (poi_orderid),
        CONSTRAINT purchase_order_items_ibfk_1 FOREIGN KEY (poi_orderid) REFERENCES purchase_order (po_orderid)
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

    await queryInterface.dropTable('purchase_order_items')
  }
};
