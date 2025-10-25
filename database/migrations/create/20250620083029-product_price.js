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
      CREATE TABLE product_price (
        pp_product_price_id int NOT NULL AUTO_INCREMENT,
        pp_product_id varchar(300) NOT NULL,
        pp_description varchar(300) NOT NULL,
        pp_barcode varchar(300) NOT NULL,
        pp_product_image longtext NOT NULL,
        pp_price varchar(300) NOT NULL,
        pp_category int NOT NULL,
        pp_previous_price varchar(300) DEFAULT NULL,
        pp_price_change varchar(300) DEFAULT NULL,
        pp_price_change_date varchar(300) DEFAULT NULL,
        pp_status varchar(300) NOT NULL,
        pp_createdby varchar(300) NOT NULL,
        pp_createddate varchar(300) NOT NULL,
        PRIMARY KEY (pp_product_price_id),
        KEY pp_category_mc_category_idx (pp_category),
        CONSTRAINT pp_category_mc_category FOREIGN KEY (pp_category) REFERENCES master_category (mc_categorycode)
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

    await queryInterface.dropTable('product_price')
  },
}
