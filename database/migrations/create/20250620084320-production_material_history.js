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
      CREATE TABLE production_material_history (
  pmh_id int NOT NULL AUTO_INCREMENT,
  pmh_countId int NOT NULL,
  pmh_baseQuantity decimal(10,2) NOT NULL,
  pmh_movementUnit varchar(20) NOT NULL,
  pmh_baseUnit varchar(20) NOT NULL,
  pmh_convertedQuantity decimal(10,2) NOT NULL,
  pmh_movementId int NOT NULL,
  pmh_type varchar(20) NOT NULL,
  pmh_date varchar(20) NOT NULL,
  pmh_stocksBefore decimal(10,2) NOT NULL,
  pmh_stocksAfter decimal(10,2) NOT NULL,
  pmh_unitBefore varchar(20) NOT NULL,
  pmh_unitAfter varchar(20) NOT NULL,
  PRIMARY KEY (pmh_id),
  KEY pmh_countId (pmh_countId),
  CONSTRAINT production_material_history_ibfk_1 FOREIGN KEY (pmh_countId) REFERENCES production_material_count (pmc_countid)
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

    await queryInterface.dropTable('production_material_history')
  },
}
