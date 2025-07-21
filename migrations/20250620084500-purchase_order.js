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

    await queryInterface.sequelize.query(`
      CREATE TABLE purchase_order (
        po_orderid int NOT NULL AUTO_INCREMENT,
        po_vendorid int NOT NULL,
        po_orderdate varchar(20) NOT NULL,
        po_deliverydate varchar(20) NOT NULL,
        po_total_amount decimal(10,2) NOT NULL,
        po_paymentterms varchar(50) NOT NULL,
        po_deliverymethod varchar(50) NOT NULL,
        po_status varchar(20) NOT NULL,
        PRIMARY KEY (po_orderid),
        KEY purchase_order_ibfk_1 (po_vendorid),
        CONSTRAINT purchase_order_ibfk_1 FOREIGN KEY (po_vendorid) REFERENCES master_vendor (mv_vendorid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('purchase_order')
  },
}
