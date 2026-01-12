'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'routes',
      {
        r_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        r_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        r_route: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        r_layout: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        r_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        r_create_at: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        r_create_by: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('routes')
  },
}
