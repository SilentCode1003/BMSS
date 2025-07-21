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
     CREATE TABLE notification (
  n_id int NOT NULL AUTO_INCREMENT,
  n_userid int NOT NULL,
  n_inventoryid varchar(300) NOT NULL,
  n_branchid varchar(300) NOT NULL,
  n_quantity int NOT NULL,
  n_message varchar(300) NOT NULL,
  n_status varchar(20) NOT NULL,
  n_checker tinyint NOT NULL,
  n_date varchar(20) NOT NULL,
  PRIMARY KEY (n_id),
  KEY n_branchid (n_branchid),
  KEY notification_ibfk_3_idx (n_userid),
  KEY notification_ibfk_1 (n_inventoryid),
  CONSTRAINT notification_ibfk_1 FOREIGN KEY (n_inventoryid) REFERENCES product_inventory (pi_inventoryid),
  CONSTRAINT notification_ibfk_2 FOREIGN KEY (n_branchid) REFERENCES master_branch (mb_branchid),
  CONSTRAINT notification_ibfk_3 FOREIGN KEY (n_userid) REFERENCES master_user (mu_usercode)
) ENGINE=InnoDB AUTO_INCREMENT=1991 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('notification')
  },
}
