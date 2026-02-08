'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_branch',
      {
        mb_branchid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        mb_branchname: {
          type: Sequelize.STRING(300),
          allowNull: false,
          primaryKey: true,
        },
        mb_tin: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mb_address: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mb_logo: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
         mb_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        mb_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mb_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_branch')
  },
}
