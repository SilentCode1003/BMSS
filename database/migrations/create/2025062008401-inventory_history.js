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
      CREATE TABLE inventory_history (
        ih_historyid int NOT NULL AUTO_INCREMENT,
        ih_productid varchar(300) NOT NULL,
        ih_quantity int NOT NULL,
        ih_type varchar(20) NOT NULL,
        ih_createddate varchar(20) NOT NULL,
        ih_createdby varchar(300) NOT NULL,
        PRIMARY KEY (ih_historyid),
        KEY inventory_history_ibfk_1_idx (ih_productid),
        CONSTRAINT inventory_history FOREIGN KEY (ih_productid) REFERENCES product_inventory (pi_inventoryid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('inventory_history')
  },
}
