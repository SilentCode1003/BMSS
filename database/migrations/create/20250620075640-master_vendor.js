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
      CREATE TABLE master_vendor (
        mv_vendorid int NOT NULL AUTO_INCREMENT,
        mv_vendorname varchar(200) NOT NULL,
        mv_contactname varchar(200) NOT NULL,
        mv_contactemail varchar(120) NOT NULL,
        mv_contactphone varchar(15) NOT NULL,
        mv_address varchar(300) NOT NULL,
        mv_status varchar(20) NOT NULL,
        mv_createdby varchar(300) NOT NULL,
        mv_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mv_vendorid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('master_vendor')
  },
}
