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
      CREATE TABLE production_product_cost (
  ppc_productionid int NOT NULL,
  ppc_componentid int NOT NULL,
  ppc_productid int NOT NULL,
  ppc_cost decimal(10,2) NOT NULL,
  ppc_status varchar(20) NOT NULL,
  ppc_createdby varchar(300) NOT NULL,
  ppc_createddate varchar(20) NOT NULL,
  PRIMARY KEY (ppc_productionid),
  KEY ppc_componentid (ppc_componentid),
  KEY ppc_productid (ppc_productid),
  CONSTRAINT production_product_cost_ibfk_1 FOREIGN KEY (ppc_componentid) REFERENCES product_component (pc_componentid),
  CONSTRAINT production_product_cost_ibfk_2 FOREIGN KEY (ppc_productid) REFERENCES production_materials (mpm_productid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_product_cost')
  }
};
