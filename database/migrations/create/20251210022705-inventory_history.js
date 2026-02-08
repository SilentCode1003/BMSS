'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'inventory_history',
      {
        ih_historyid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ih_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'product_inventory',
            key: 'pi_inventoryid',
          },
        },
        ih_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ih_type: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ih_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ih_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_history')
  },
}
