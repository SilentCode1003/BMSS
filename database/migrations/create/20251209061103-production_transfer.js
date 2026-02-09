'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_transfer',
      {
        pt_transferid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pt_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        pt_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pt_branchid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        pt_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pt_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pt_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_transfer')
  },
}
