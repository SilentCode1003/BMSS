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
      CREATE TABLE production_transfer (
        pt_transferid int NOT NULL AUTO_INCREMENT,
        pt_productid int NOT NULL,
        pt_quantity int NOT NULL,
        pt_branchid varchar(300) NOT NULL,
        pt_status varchar(20) NOT NULL,
        pt_createdby varchar(300) NOT NULL,
        pt_createddate varchar(20) NOT NULL,
        PRIMARY KEY (pt_transferid),
        KEY pt_branchid (pt_branchid),
        KEY production_transfer_ibfk_1_idx (pt_productid),
        CONSTRAINT production_transfer_ibfk_1 FOREIGN KEY (pt_productid) REFERENCES master_product (mp_productid),
        CONSTRAINT production_transfer_ibfk_2 FOREIGN KEY (pt_branchid) REFERENCES master_branch (mb_branchid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_transfer')
  }
};
