'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'sales_inventory_history',
      {
        sih_historyid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sih_detailid: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        sih_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sih_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sih_branch: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        sih_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_inventory_history')
  },
}
