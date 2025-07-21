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
      CREATE TABLE refund (
  r_id int NOT NULL AUTO_INCREMENT,
  r_detailid varchar(300) NOT NULL,
  r_reason varchar(300) NOT NULL,
  r_cashier int NOT NULL,
  r_date varchar(20) NOT NULL,
  PRIMARY KEY (r_id),
  KEY refund_lbfk_1_idx (r_detailid),
  KEY refund_lbfk_2_idx (r_cashier),
  CONSTRAINT refund_lbfk_1 FOREIGN KEY (r_detailid) REFERENCES sales_detail (st_detail_id),
  CONSTRAINT refund_lbfk_2 FOREIGN KEY (r_cashier) REFERENCES master_employees (me_employeeid)
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

    await queryInterface.dropTable('refund')
  }
};
