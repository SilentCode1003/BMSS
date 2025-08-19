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
      CREATE TABLE routes (
        r_id INT NOT NULL AUTO_INCREMENT,
        r_name VARCHAR(300) NOT NULL,
        r_route VARCHAR(300) NOT NULL,
        r_layout VARCHAR(300) NOT NULL,
        r_status ENUM('active', 'inactive') NOT NULL,
        r_create_at VARCHAR(20) NOT NULL,
        r_create_by VARCHAR(300) NOT NULL,
        PRIMARY KEY (r_id));
      `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('routes')
  },
}
