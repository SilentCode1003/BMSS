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
      CREATE TABLE production_inventory (
        pi_inventoryid int NOT NULL AUTO_INCREMENT,
        pi_productid int NOT NULL,
        pi_quantity int NOT NULL,
        PRIMARY KEY (pi_inventoryid),
        KEY pi_productid (pi_productid),
        CONSTRAINT production_inventory_ibfk_1 FOREIGN KEY (pi_productid) REFERENCES master_product (mp_productid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_inventory')
  },
}
