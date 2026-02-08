'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_access_type',
      {
        mat_accesscode: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mat_accessname: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        mat_status: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mat_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mat_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_access_type')
  },
}
