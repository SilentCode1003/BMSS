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
      CREATE TABLE production_material_stock_adjustment (
  pmsa_id int NOT NULL AUTO_INCREMENT,
  pmsa_date varchar(20) NOT NULL,
  pmsa_note text NOT NULL,
  pmsa_content longtext NOT NULL,
  pmsa_status varchar(20) NOT NULL,
  PRIMARY KEY (pmsa_id)
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

    await queryInterface.dropTable('production_material_stock_adjustment')
  },
}
