'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'access_route',
      {
        ar_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ar_access_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_access_type',
            key: 'mat_accesscode',
          },
        },
        ar_route_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'routes',
            key: 'r_id',
          },
        },
        ar_access_type: {
          type: Sequelize.ENUM('full', 'read', 'write'),
          allowNull: false,
        },
        ar_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        ar_create_at: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ar_create_by: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('access_route')
  },
}
