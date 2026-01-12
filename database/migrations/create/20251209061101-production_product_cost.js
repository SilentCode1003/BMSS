'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_product_cost',
      {
        ppc_productionid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ppc_componentid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'production_components',
            key: 'pc_componentid',
          },
        },
        ppc_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        ppc_cost: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        ppc_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ppc_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ppc_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_product_cost')
  },
}
