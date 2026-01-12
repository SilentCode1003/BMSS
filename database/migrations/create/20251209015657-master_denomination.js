'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_denomination',
      {
        md_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        md_code: {
          type: Sequelize.STRING(6),
          allowNull: false,
          primaryKey: true,
        },
        md_description: {
          type: Sequelize.STRING(120),
          allowNull: false,
          primaryKey: true,
        },
        md_value: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          primaryKey: true,
        },
        md_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        md_create_by: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        md_create_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_denomination')
  },
}
