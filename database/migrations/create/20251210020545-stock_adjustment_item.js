'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'stock_adjustment_item',
      {
        sai_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sai_detailid: {
          type: Sequelize.STRING(5),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        sai_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        sai_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sai_stockafter: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_adjustment_item')
  },
}
