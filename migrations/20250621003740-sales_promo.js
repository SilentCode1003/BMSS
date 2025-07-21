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
      CREATE TABLE sales_promo (
        sp_id int NOT NULL AUTO_INCREMENT,
        sp_promoid int NOT NULL,
        sp_detailid varchar(300) NOT NULL,
        PRIMARY KEY (sp_id),
        KEY sp_detailid (sp_detailid),
        KEY sp_promoid (sp_promoid),
        CONSTRAINT sales_promo_ibfk_1 FOREIGN KEY (sp_detailid) REFERENCES sales_detail (st_detail_id),
        CONSTRAINT sales_promo_ibfk_2 FOREIGN KEY (sp_promoid) REFERENCES promo_details (pd_promoid)
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

    await queryInterface.dropTable('sales_promo')
  }
};
