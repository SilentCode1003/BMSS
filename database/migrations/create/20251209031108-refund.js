'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'refund',
      {
        r_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        r_detailid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'sales_detail',
            key: 'st_detail_id',
          },
        },
        r_reason: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'discounts_details',
            key: 'dd_discountid',
          },
        },
        r_cashier: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_employees',
            key: 'me_employeeid',
          },
        },
        r_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refund')
  },
}
