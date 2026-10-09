'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_deposit_slip_sales_history', {
      cdssh_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      cdssh_cash_deposit_slip_sales_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'cash_deposit_slip_sales',
          key: 'cdss_id',
        },
      },
      cdssh_description: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      cdssh_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cash_deposit_slip_sales_history');
  }
};
