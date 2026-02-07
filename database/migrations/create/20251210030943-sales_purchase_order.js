'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_purchase_order', {
      spo_reference_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      spo_sales_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_purchase_order')
  },
}
