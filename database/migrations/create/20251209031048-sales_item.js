'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'sales_item',
      {
        si_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        si_detail_id: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        si_date: {
          type: Sequelize.STRING(300),
        },
        si_item: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        si_price: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        si_quantity: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        si_total: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_item')
  },
}
