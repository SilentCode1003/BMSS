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
      CREATE TABLE request_notification (
  rn_id int NOT NULL AUTO_INCREMENT,
  rn_type varchar(300) NOT NULL,
  rn_userid int NOT NULL,
  rn_branchid varchar(300) NOT NULL,
  rn_message mediumtext NOT NULL,
  rn_status varchar(20) NOT NULL,
  rn_date varchar(20) NOT NULL,
  PRIMARY KEY (rn_id),
  KEY rn_fk_userid_idx (rn_userid),
  KEY rn_fk_branch_idx (rn_branchid),
  CONSTRAINT rn_fk_branch FOREIGN KEY (rn_branchid) REFERENCES master_branch (mb_branchid),
  CONSTRAINT rn_fk_userid FOREIGN KEY (rn_userid) REFERENCES master_user (mu_usercode)
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

    await queryInterface.dropTable('request_notification')
  }
};
