'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('shift_report', {
      sr_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      sr_pos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      sr_shift: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        primaryKey: true,
      },
      sr_cashier: {
        type: Sequelize.STRING(300),
        allowNull: false,
        primaryKey: true,
      },
      sr_floating: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sr_cash_float: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      sr_sales_beginning: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      sr_sales_ending: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      sr_total_sales: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      sr_receipt_beginning: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
      },
      sr_receipt_ending: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      sr_status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      sr_approvedby: {
        type: Sequelize.STRING(300),
        allowNull: true,
      },
      sr_approveddate: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('shift_report')
  },
}
