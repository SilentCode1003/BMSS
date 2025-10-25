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
      CREATE TABLE cashdrawer_report (
        cr_id int NOT NULL AUTO_INCREMENT,
        cr_branch_id varchar(4) NOT NULL,
        cr_shift varchar(2) NOT NULL,
        cr_date varchar(20) NOT NULL,
        cr_pos_id varchar(4) NOT NULL,
        cr_user_id varchar(300) NOT NULL,
        cr_total decimal(10,2) NOT NULL,
        cr_denomination longtext NOT NULL,
        PRIMARY KEY (cr_id)
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
  },
}
