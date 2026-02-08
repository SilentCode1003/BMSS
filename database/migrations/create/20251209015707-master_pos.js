'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_pos',
      {
        mp_posid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mp_posname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_serial: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_min: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_ptu: {
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
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_pos')
  },
}
