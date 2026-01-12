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
      CREATE TABLE master_pos (
        mp_posid int NOT NULL AUTO_INCREMENT,
        mp_posname varchar(300) NOT NULL,
        mp_serial varchar(300) NOT NULL,
        mp_min varchar(300) NOT NULL,
        mp_ptu varchar(300) NOT NULL,
        mp_status varchar(300) NOT NULL,
        mp_createdby varchar(300) NOT NULL,
        mp_createddate varchar(20) NOT NULL,
        PRIMARY KEY (mp_posid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('master_pos')
  }
};
