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
      CREATE TABLE pos_config (
  pc_id int NOT NULL AUTO_INCREMENT,
  pc_pos_id int NOT NULL,
  pc_pos_printer varchar(255) NOT NULL,
  pc_production_kitchen_printer_ip varchar(255) NOT NULL,
  pc_paper_size varchar(255) NOT NULL,
  pc_printer_name varchar(255) DEFAULT NULL,
  pc_isblutooth tinyint(1) NOT NULL,
  pc_isprinter tinyint(1) NOT NULL,
  pc_iscashdrawer tinyint(1) NOT NULL,
  pc_issync tinyint(1) NOT NULL,
  PRIMARY KEY (pc_id),
  KEY pc_pos_id (pc_pos_id),
  CONSTRAINT pos_config_ibfk_1 FOREIGN KEY (pc_pos_id) REFERENCES master_pos (mp_posid) ON DELETE CASCADE ON UPDATE CASCADE
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

    await queryInterface.dropTable('pos_config')
  },
}
