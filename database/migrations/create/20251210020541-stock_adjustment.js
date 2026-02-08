'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'stock_adjustment',
      {
        sa_adjustmentid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sa_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        sa_adjustmentdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sa_adjustmenttype: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sa_quantityadjusted: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        sa_reason: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        sa_adjustedby: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_user',
            key: 'mu_usercode',
          },
        },
        sa_notes: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_adjustment')
  },
}
