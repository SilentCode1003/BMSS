'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_user',
      {
        mu_usercode: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mu_employeeid: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mu_accesstype: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_access_type',
            key: 'mat_accesscode',
          },
        },
        mu_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mu_username: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mu_password: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mu_branchid: {
          type: Sequelize.STRING(300),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        mu_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mu_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 200000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_user')
  },
}
