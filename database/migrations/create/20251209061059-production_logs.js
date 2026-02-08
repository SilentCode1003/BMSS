'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_logs',
      {
        pl_logid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pl_description: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pl_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pl_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_logs')
  },
}
