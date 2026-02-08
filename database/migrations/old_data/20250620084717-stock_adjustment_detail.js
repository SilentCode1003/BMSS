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
      CREATE TABLE stock_adjustment_detail (
  sad_id int NOT NULL AUTO_INCREMENT,
  sad_branchid varchar(300) NOT NULL,
  sad_details longtext NOT NULL,
  sad_reason varchar(300) NOT NULL,
  sad_createddate varchar(20) NOT NULL,
  sad_createdby varchar(300) NOT NULL,
  sad_notes longtext,
  sad_status varchar(20) NOT NULL,
  sad_attachments longtext,
  PRIMARY KEY (sad_id),
  KEY sad_branchid (sad_branchid),
  CONSTRAINT stock_adjustment_detail_ibfk_1 FOREIGN KEY (sad_branchid) REFERENCES master_branch (mb_branchid)
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

    await queryInterface.dropTable('stock_adjustment_detail')
  }
};
