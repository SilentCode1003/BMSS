'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'epayment_details',
      {
        ed_paymentid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ed_detailid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'sales_detail',
            key: 'st_detail_id',
          },
        },
        ed_type: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
        },
        ed_referenceid: {
          type: Sequelize.STRING(120),
          allowNull: false,
        },
        ed_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('epayment_details')
  },
}
