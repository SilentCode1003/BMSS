'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_material_stock_adjustment',
      {
        pmsa_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pmsa_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmsa_note: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pmsa_content: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pmsa_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_material_stock_adjustment')
  },
}
