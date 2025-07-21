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
      CREATE TABLE master_material_cost (
        mmc_materialid int NOT NULL AUTO_INCREMENT,
        mmc_materialname varchar(300) NOT NULL,
        mmc_unitcost varchar(300) NOT NULL,
        mmc_unit varchar(300) NOT NULL,
        mmc_status varchar(20) NOT NULL,
        mmc_createdby varchar(300) NOT NULL,
        mmc_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mmc_materialid)
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

    await queryInterface.dropTable('master_material_cost')
  },
}
