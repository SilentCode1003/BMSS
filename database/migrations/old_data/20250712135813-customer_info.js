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
      `CREATE TABLE customer_info (
          ci_id int NOT NULL AUTO_INCREMENT,
          ci_type varchar(300) NOT NULL,
          ci_company varchar(300) NOT NULL,
          ci_fullname varchar(300) NOT NULL,
          ci_email varchar(300) DEFAULT NULL,
          ci_phone varchar(13) DEFAULT NULL,
          ci_mobile varchar(13) DEFAULT NULL,
          ci_address text,
          ci_create_at varchar(20) NOT NULL,
          ci_create_by varchar(20) NOT NULL,
          PRIMARY KEY (ci_id)
        ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci`
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('customer_info')
  },
}

