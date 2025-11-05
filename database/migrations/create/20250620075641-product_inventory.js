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
      CREATE TABLE product_inventory (
        pi_inventoryid varchar(300) NOT NULL,
        pi_productid int NOT NULL,
        pi_branchid varchar(5) NOT NULL,
        pi_quantity int NOT NULL,
        pi_category int NOT NULL,
        PRIMARY KEY (pi_inventoryid),
        KEY pi_productid (pi_productid),
        KEY pi_branchid (pi_branchid),
        KEY product_inventory_ibfk_2_idx (pi_category),
        CONSTRAINT product_inventory_ibfk_1 FOREIGN KEY (pi_productid) REFERENCES master_product (mp_productid),
        CONSTRAINT product_inventory_ibfk_2 FOREIGN KEY (pi_branchid) REFERENCES master_branch (mb_branchid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('product_inventory')
  },
}
