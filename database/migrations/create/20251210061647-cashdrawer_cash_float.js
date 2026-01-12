'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cashdrawer_cash_float',
      {
        ccf_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ccf_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ccf_branch_id: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        ccf_pos: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        ccf_shift: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        ccf_cashier: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ccf_cash_float: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        ccf_denomination: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cashdrawer_cash_float')
  },
}
