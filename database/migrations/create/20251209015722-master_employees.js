'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_employees',
      {
        me_employeeid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        me_fullname: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        me_position: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_position_type',
            key: 'mpt_positioncode',
          },
        },
        me_contactinfo: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        me_datehired: {
          type: Sequelize.STRING(20),
          allowNull: false,
          primaryKey: true,
        },
        me_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        me_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        me_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 200000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_employees')
  },
}
