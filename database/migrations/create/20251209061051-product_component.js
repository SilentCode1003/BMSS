'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'product_component',
      {
        pc_componentid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pc_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        pc_components: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pc_totalcost: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pc_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pc_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pc_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_component')
  },
}
