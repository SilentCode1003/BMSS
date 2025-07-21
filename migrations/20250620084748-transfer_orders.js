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
      CREATE TABLE transfer_orders (
  to_transferid int NOT NULL AUTO_INCREMENT,
  to_fromlocationid varchar(300) NOT NULL,
  to_tolocationid varchar(300) NOT NULL,
  to_transferdate varchar(20) NOT NULL,
  to_totalquantity int NOT NULL,
  to_status varchar(20) NOT NULL,
  to_notes text,
  PRIMARY KEY (to_transferid),
  KEY to_fromlocationid (to_fromlocationid),
  KEY to_tolocationid (to_tolocationid),
  CONSTRAINT transfer_orders_ibfk_1 FOREIGN KEY (to_fromlocationid) REFERENCES master_branch (mb_branchid),
  CONSTRAINT transfer_orders_ibfk_2 FOREIGN KEY (to_tolocationid) REFERENCES master_branch (mb_branchid)
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

    await queryInterface.dropTable('transfer_orders')
  }
};
