'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_category',
      {
        mc_categorycode: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mc_categoryname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mc_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mc_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mc_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        mc_is_display: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_category')
  },
}
