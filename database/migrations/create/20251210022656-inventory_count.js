'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'inventory_count',
      {
        ic_countid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ic_count_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ic_locationid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ic_countby: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        ic_countverification: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        ic_notes: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_count')
  },
}
