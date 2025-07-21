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
      CREATE TABLE pos_shift_logs (
  psl_id int NOT NULL AUTO_INCREMENT,
  psl_posid int NOT NULL,
  psl_date varchar(20) NOT NULL,
  psl_shift varchar(1) NOT NULL,
  psl_status varchar(300) NOT NULL,
  PRIMARY KEY (psl_id),
  KEY psl_posid (psl_posid),
  CONSTRAINT pos_shift_logs_ibfk_1 FOREIGN KEY (psl_posid) REFERENCES master_pos (mp_posid)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('pos_shift_logs')
  },
}
