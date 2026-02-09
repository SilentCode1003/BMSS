'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_location',
      {
        ml_locationid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ml_locationname: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        ml_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        ml_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ml_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_location')
  },
}
