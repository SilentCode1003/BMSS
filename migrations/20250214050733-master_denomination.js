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

    await queryInterface.createTable('master_denomination', {
      md_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      md_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      md_description: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      md_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      md_status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
      },
      md_create_by: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      md_create_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('master_denomination');
  }
};
