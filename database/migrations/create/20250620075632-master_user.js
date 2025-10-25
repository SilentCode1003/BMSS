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

    await queryInterface.sequelize.query(
      `
      CREATE TABLE master_user (
        mu_usercode int NOT NULL AUTO_INCREMENT,
        mu_employeeid varchar(300) NOT NULL,
        mu_accesstype int NOT NULL,
        mu_status varchar(300) NOT NULL,
        mu_username varchar(300) NOT NULL,
        mu_password varchar(300) NOT NULL,
        mu_branchid varchar(300) NOT NULL,
        mu_createdby varchar(300) NOT NULL,
        mu_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mu_usercode),
        KEY fk_user_branch (mu_branchid),
        KEY fk_user_access_idx (mu_accesstype),
        CONSTRAINT fk_user_access FOREIGN KEY (mu_accesstype) REFERENCES master_access_type (mat_accesscode),
        CONSTRAINT fk_user_branch FOREIGN KEY (mu_branchid) REFERENCES master_branch (mb_branchid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('master_user')
  }
};
