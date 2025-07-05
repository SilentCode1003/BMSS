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
      `CREATE TABLE cash_drop (
        cd_id int NOT NULL AUTO_INCREMENT,
        cd_branch_id varchar(4) NOT NULL,
        cd_shift_number varchar(2) NOT NULL,
        cd_shift_date varchar(20) NOT NULL,
        cd_pos_id varchar(4) NOT NULL,
        cd_user_id varchar(300) NOT NULL,
        cd_datetime varchar(20) NOT NULL,
        cd_amount decimal(10,2) NOT NULL,
        PRIMARY KEY (cd_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

  `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('cash_report')
  }
};
