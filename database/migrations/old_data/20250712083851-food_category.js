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
      `CREATE TABLE food_category (
        fc_id INT NOT NULL AUTO_INCREMENT,
        fc_name VARCHAR(300) NOT NULL,
        fc_status ENUM('active', 'inactive') NOT NULL,
        fc_create_at VARCHAR(20) NOT NULL,
        fc_create_by VARCHAR(300) NOT NULL,
        PRIMARY KEY (fc_id))`
      );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('food_category');
  }
};
