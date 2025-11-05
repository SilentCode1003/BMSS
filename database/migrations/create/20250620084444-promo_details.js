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
      CREATE TABLE promo_details (
  pd_promoid int NOT NULL AUTO_INCREMENT,
  pd_name varchar(300) NOT NULL,
  pd_description text NOT NULL,
  pd_dtipermit varchar(20) NOT NULL,
  pd_condition text NOT NULL,
  pd_startdate varchar(20) NOT NULL,
  pd_enddate varchar(20) NOT NULL,
  pd_status varchar(20) NOT NULL,
  pd_createdby varchar(300) NOT NULL,
  pd_createddate varchar(20) NOT NULL,
  PRIMARY KEY (pd_promoid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('promo_details')
  },
}
