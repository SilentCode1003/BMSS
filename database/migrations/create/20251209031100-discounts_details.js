'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'discounts_details',
      {
        dd_discountid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        dd_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        dd_description: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        dd_rate: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false,
        },
        dd_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        dd_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        dd_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discounts_details')
  },
}
