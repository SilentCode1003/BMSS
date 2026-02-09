'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'customer_transaction',
      {
        ct_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ct_customer_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'customer_info',
            key: 'ci_id',
          },
        },
        ct_sales_id: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ct_status: {
          type: Sequelize.ENUM('buy', 'refund', 'cance;'),
          allowNull: false,
        },
        ct_create_at: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer_transaction')
  },
}
