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
      CREATE TABLE system_logs (
  sl_logid int NOT NULL AUTO_INCREMENT,
  sl_logdate varchar(20) NOT NULL,
  sl_loglevel varchar(20) NOT NULL,
  sl_source varchar(50) NOT NULL,
  sl_message text NOT NULL,
  sl_userid int NOT NULL,
  sl_ipaddress varchar(20) NOT NULL,
  PRIMARY KEY (sl_logid)
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

    await queryInterface.dropTable('system_logs')
  }
};
