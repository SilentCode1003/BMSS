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
      CREATE TABLE production_materials (
  mpm_productid int NOT NULL AUTO_INCREMENT,
  mpm_productname varchar(300) NOT NULL,
  mpm_description text NOT NULL,
  mpm_category int NOT NULL,
  mpm_vendorid int NOT NULL,
  mpm_price decimal(10,2) NOT NULL,
  mpm_status varchar(20) NOT NULL,
  mpm_createdby varchar(300) NOT NULL,
  mpm_createddate varchar(20) NOT NULL,
  PRIMARY KEY (mpm_productid),
  KEY mpm_vendorid (mpm_vendorid),
  KEY mpm_fk_category_idx (mpm_category),
  CONSTRAINT mpm_fk_category FOREIGN KEY (mpm_category) REFERENCES master_category (mc_categorycode),
  CONSTRAINT production_materials_ibfk_1 FOREIGN KEY (mpm_vendorid) REFERENCES master_vendor (mv_vendorid)
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

    await queryInterface.dropTable('production_materials')
  }
};
