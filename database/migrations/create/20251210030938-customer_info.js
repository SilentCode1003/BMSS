'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'customer_info',
      {
        ci_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ci_type: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ci_company: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ci_fullname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ci_email: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ci_phone: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
        ci_mobile: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
        ci_address: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        ci_create_at: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ci_create_by: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer_info')
  },
}
