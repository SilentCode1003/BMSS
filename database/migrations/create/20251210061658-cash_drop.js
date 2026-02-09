'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cash_drop',
      {
        cd_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        cd_branch_id: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        cd_shift_number: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        cd_shift_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        cd_pos_id: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        cd_user_id: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        cd_datetime: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        cd_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cash_drop')
  },
}
