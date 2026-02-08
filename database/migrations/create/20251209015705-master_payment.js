'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_payment',
      {
        mp_paymentid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mp_paymentname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mp_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_payment')
  },
}
