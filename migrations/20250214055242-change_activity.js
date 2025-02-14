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

    await queryInterface.createTable('change_activity', {
      ca_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ca_detail_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        references: {
          model: 'sales_detail',
          key: 'st_detail_id',
        },
      },
      ca_total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      ca_cash_tender: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      ca_change: {
        type: Sequelize.DECIMAL(10, 2),
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

    await queryInterface.dropTable('change_activity');
  }
};
