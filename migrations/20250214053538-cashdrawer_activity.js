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

    await queryInterface.createTable('cashdrawer_activity', {
      ca_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ca_shift_number: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      ca_pos_id: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      ca_shift_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      ca_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_user',
          key: 'mu_usercode',
        },
      },
      ca_datetime: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      ca_description: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      ca_status: {
        type: Sequelize.ENUM('TRANSACTION', 'OPEN', 'START SHIFT', 'END SHIFT'),
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
    await queryInterface.dropTable('cashdrawer_activity');
  }
};
