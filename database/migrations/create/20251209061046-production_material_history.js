'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_material_history',
      {
        pmh_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pmh_countId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'production_materials',
            key: 'mpm_productid',
          },
        },
        pmh_baseQuantity: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        pmh_movementUnit: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmh_baseUnit: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmh_convertedQuantity: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        pmh_movementId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pmh_type: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmh_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmh_stocksBefore: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        pmh_stocksAfter: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        pmh_unitBefore: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmh_unitAfter: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_material_history')
  },
}
