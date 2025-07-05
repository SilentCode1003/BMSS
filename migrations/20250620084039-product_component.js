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
        CREATE TABLE product_component (
        pc_componentid int NOT NULL AUTO_INCREMENT,
        pc_productid int NOT NULL,
        pc_components longtext NOT NULL,
        pc_status varchar(20) NOT NULL,
        pc_createdby varchar(300) NOT NULL,
        pc_createddate varchar(20) NOT NULL,
        PRIMARY KEY (pc_componentid),
        KEY product_component_ibfk_1_idx (pc_productid),
        CONSTRAINT product_component_ibfk_1 FOREIGN KEY (pc_productid) REFERENCES master_product (mp_productid)
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

    await queryInterface.dropTable('product_component')
  },
}
