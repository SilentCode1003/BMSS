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
      CREATE TABLE cashier_activity (
        ca_activityid int NOT NULL AUTO_INCREMENT,
        ca_detailid varchar(300) NOT NULL,
        ca_paymenttype varchar(300) NOT NULL,
        ca_amount decimal(10,2) NOT NULL,
        ca_date varchar(20) NOT NULL,
        PRIMARY KEY (ca_activityid)
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

    await queryInterface.dropTable('cashier_activity')
  },
}
