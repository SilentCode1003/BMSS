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
      CREATE TABLE history (
        h_id int NOT NULL AUTO_INCREMENT,
        h_branch varchar(300) NOT NULL,
        h_quantity int NOT NULL,
        h_date varchar(20) NOT NULL,
        h_productid int NOT NULL,
        h_inventoryid varchar(300) NOT NULL,
        h_movementid int NOT NULL,
        h_type varchar(20) NOT NULL,
        h_stocksafter int NOT NULL,
        PRIMARY KEY (h_id),
        KEY h_branch (h_branch),
        KEY h_productid (h_productid),
        KEY h_inventoryid (h_inventoryid),
        CONSTRAINT history_ibfk_1 FOREIGN KEY (h_branch) REFERENCES master_branch (mb_branchid),
        CONSTRAINT history_ibfk_2 FOREIGN KEY (h_productid) REFERENCES master_product (mp_productid),
        CONSTRAINT history_ibfk_3 FOREIGN KEY (h_inventoryid) REFERENCES product_inventory (pi_inventoryid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('history')
  },
}
