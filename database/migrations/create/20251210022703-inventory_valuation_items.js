'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'inventory_valuation_items',
      {
        ivi_itemid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ivi_reportid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'inventory_valuation_report',
            key: 'ivr_reportid',
          },
        },
        ivi_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        ivi_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ivi_unitcost: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
        },
        ivi_totalvalue: {
          type: Sequelize.DECIMAL(20, 2),
          allowNull: false,
        },
        ivi_branchid: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        ivi_category: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ivi_productname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_valuation_items')
  },
}
