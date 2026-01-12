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
      CREATE TABLE master_branch (
        mb_branchid varchar(300) NOT NULL,
        mb_branchname varchar(300) NOT NULL,
        mb_tin varchar(300) NOT NULL,
        mb_address varchar(300) NOT NULL,
        mb_logo longtext,
        mb_status varchar(300) NOT NULL,
        mb_createdby varchar(300) NOT NULL,
        mb_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mb_branchid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('master_branch')
  },
}
