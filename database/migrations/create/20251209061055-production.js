'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production',
      {
        p_productionid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        p_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'production',
            key: 'p_productionid',
          },
        },
        p_startdate: {
          type: Sequelize.STRING(20),
        },
        p_enddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        p_quantityproduced: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        p_productionline: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        p_supervisorid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_employees',
            key: 'me_employeeid',
          },
        },
        p_notes: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        p_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production')
  },
}
