'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'sales_discount',
      {
        sd_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sd_detailid: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        sd_discountid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'discounts_details',
            key: 'dd_discountid',
          },
        },
        sd_customerinfo: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        sd_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_discount')
  },
}
