'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pos_shift_logs', {
      psl_posid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      psl_posid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'master_pos',
          key: 'mp_posid',
        },
      },
      psl_date: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      psl_shift: {
        type: Sequelize.STRING(1),
        allowNull: false,
      },
      psl_status: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pos_shift_logs')
  },
}
