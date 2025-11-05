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
      CREATE TABLE cashdrawer_activity (
        ca_id int NOT NULL AUTO_INCREMENT,
        ca_branch_id varchar(4) NOT NULL,
        ca_shift_number varchar(2) NOT NULL,
        ca_pos_id varchar(4) NOT NULL,
        ca_shift_date varchar(20) NOT NULL,
        ca_user_id varchar(300) NOT NULL,
        ca_datetime varchar(20) NOT NULL,
        ca_description longtext NOT NULL,
        ca_status enum('cash','split','refund','transaction','discount','promo','other','cashdrop','startshift','endshift','open') NOT NULL,
        PRIMARY KEY (ca_id)
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

    await queryInterface.dropTable('cashdrawer_activity')
  },
}
