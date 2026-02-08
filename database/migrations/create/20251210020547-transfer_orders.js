'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'transfer_orders',
      {
        to_transferid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        to_fromlocationid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        to_tolocationid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        to_transferdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        to_totalquantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        to_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        to_notes: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transfer_orders')
  },
}
