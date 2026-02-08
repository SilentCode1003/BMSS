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
      CREATE TABLE stock_adjustment (
  sa_adjustmentid int NOT NULL AUTO_INCREMENT,
  sa_productid int NOT NULL,
  sa_adjustmentdate varchar(20) NOT NULL,
  sa_adjustmenttype varchar(20) NOT NULL,
  sa_quantityadjusted int NOT NULL,
  sa_reason text NOT NULL,
  sa_adjustedby int NOT NULL,
  sa_notes text NOT NULL,
  PRIMARY KEY (sa_adjustmentid),
  KEY sa_productid (sa_productid),
  KEY sa_adjustedby (sa_adjustedby),
  CONSTRAINT stock_adjustment_ibfk_1 FOREIGN KEY (sa_productid) REFERENCES master_product (mp_productid),
  CONSTRAINT stock_adjustment_ibfk_2 FOREIGN KEY (sa_adjustedby) REFERENCES master_employees (me_employeeid)
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

    await queryInterface.dropTable('stock_adjustment')
  }
};
