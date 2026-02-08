'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cashier_activity',
      {
        ca_activityid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ca_detailid: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ca_paymenttype: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
        },
        ca_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        ca_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cashier_activity')
  },
}
