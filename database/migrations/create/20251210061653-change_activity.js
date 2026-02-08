'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'change_activity',
      {
        ca_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ca_detail_id: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ca_total_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        ca_cash_tender: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        ca_change: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('change_activity')
  },
}
