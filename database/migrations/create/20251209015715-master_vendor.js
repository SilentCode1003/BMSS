'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_vendor',
      {
        mv_vendorid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mv_vendorname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mv_contactname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mv_contactnumber: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mv_contactemail: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mv_contactphone: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        mv_address: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        mv_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mv_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mv_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_vendor')
  },
}
