'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_activities',
      {
        pa_activityid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pa_productionid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'production',
            key: 'p_productionid',
          },
        },
        pa_activityname: {
          type: Sequelize.STRING(100),
        },
        pa_startdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pa_enddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pa_workerid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_activities')
  },
}
