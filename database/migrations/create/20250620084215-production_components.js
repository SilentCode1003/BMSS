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
      CREATE TABLE production_components (
        pc_componentid int NOT NULL AUTO_INCREMENT,
        pc_productid int NOT NULL,
        pc_details varchar(300) NOT NULL,
        pc_totalcost varchar(20) NOT NULL,
        pc_status varchar(20) NOT NULL,
        pc_createdby varchar(300) NOT NULL,
        pc_createddate varchar(20) NOT NULL,
        PRIMARY KEY (pc_componentid),
        KEY pc_productid (pc_productid),
        CONSTRAINT production_components_ibfk_1 FOREIGN KEY (pc_productid) REFERENCES master_product (mp_productid)
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

    await queryInterface.dropTable('production_components')
  },
}
