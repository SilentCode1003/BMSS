'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cash_report',
      {
        cr_report_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        cr_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        cr_shift: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        cr_pos: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        cr_cashier: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        cr_type: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        cr_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cash_report')
  },
}
