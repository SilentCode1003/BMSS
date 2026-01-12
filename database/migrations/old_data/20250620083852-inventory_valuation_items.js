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
      CREATE TABLE inventory_valuation_items (
  ivi_itemid int NOT NULL AUTO_INCREMENT,
  ivi_reportid int NOT NULL,
  ivi_productid int NOT NULL,
  ivi_quantity int NOT NULL,
  ivi_unitcost decimal(10,2) NOT NULL,
  ivi_totalvalue decimal(10,2) NOT NULL,
  ivi_branchid varchar(5) NOT NULL,
  ivi_category varchar(300) NOT NULL,
  ivi_productname varchar(300) NOT NULL,
  PRIMARY KEY (ivi_itemid),
  KEY ivi_reportid (ivi_reportid),
  KEY ivi_productid (ivi_productid),
  CONSTRAINT inventory_valuation_items_ibfk_1 FOREIGN KEY (ivi_reportid) REFERENCES inventory_valuation_report (ivr_reportid),
  CONSTRAINT inventory_valuation_items_ibfk_2 FOREIGN KEY (ivi_productid) REFERENCES master_product (mp_productid)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

    await queryInterface.dropTable('inventory_valuation_items')
  },
}
