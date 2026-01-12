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
      CREATE TABLE production_material_count (
        pmc_countid int NOT NULL AUTO_INCREMENT,
        pmc_productid int NOT NULL,
        pmc_quantity decimal(10,5) NOT NULL,
        pmc_unit varchar(20) NOT NULL,
        pmc_status varchar(20) NOT NULL,
        pmc_createdby varchar(300) NOT NULL,
        pmc_createddate varchar(20) NOT NULL,
        pmc_updateddate varchar(20) DEFAULT NULL,
        PRIMARY KEY (pmc_countid),
        KEY pmc_productid (pmc_productid),
        CONSTRAINT production_material_count_ibfk_1 FOREIGN KEY (pmc_productid) REFERENCES production_materials (mpm_productid)
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

    await queryInterface.dropTable('production_material_count')
  }
};
