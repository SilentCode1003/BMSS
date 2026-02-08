'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_detail', {
      st_detail_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        primaryKey: true,
      },
      st_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      st_pos_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      st_shift: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      st_payment_type: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      st_description: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      st_total: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      st_cashier: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      st_branch: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      st_status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_detail')
  },
}
