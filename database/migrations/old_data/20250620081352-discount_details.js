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
      CREATE TABLE discounts_details (
        dd_discountid int NOT NULL AUTO_INCREMENT,
        dd_name varchar(300) NOT NULL,
        dd_description text NOT NULL,
        dd_rate decimal(5,2) NOT NULL,
        dd_status varchar(20) NOT NULL,
        dd_createdby varchar(300) NOT NULL,
        dd_createddate varchar(20) NOT NULL,
        PRIMARY KEY (dd_discountid)
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

    await queryInterface.dropTable('discounts_details')
  },
}
