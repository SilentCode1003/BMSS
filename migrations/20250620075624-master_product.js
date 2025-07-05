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
      CREATE TABLE master_product (
        mp_productid int NOT NULL AUTO_INCREMENT,
        mp_description varchar(300) NOT NULL,
        mp_price varchar(300) NOT NULL,
        mp_category int NOT NULL,
        mp_barcode varchar(300) NOT NULL,
        mp_productimage longtext,
        mp_status varchar(300) NOT NULL,
        mp_createdby varchar(300) NOT NULL,
        mp_createddate varchar(20) NOT NULL,
        mp_cost decimal(10,2) DEFAULT NULL,
        PRIMARY KEY (mp_productid),
        KEY mp_category_mc_cateagory_idx (mp_category),
        CONSTRAINT mp_category_mc_cateagory FOREIGN KEY (mp_category) REFERENCES master_category (mc_categorycode)
      ) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

    await queryInterface.dropTable('master_product')
  },
}
