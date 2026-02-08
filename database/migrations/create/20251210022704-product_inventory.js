'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'product_inventory',
      {
        pi_inventoryid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pi_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        pi_branchid: {
          type: Sequelize.STRING(5),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        pi_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pi_category: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_category',
            key: 'mc_categorycode',
          },
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_inventory')
  },
}
