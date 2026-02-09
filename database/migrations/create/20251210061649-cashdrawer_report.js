'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cashdrawer_report',
      {
        cr_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        cr_branch_id: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        cr_shift: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        cr_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        cr_pos_id: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        cr_user_id: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        cr_total: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        cr_denomination: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cashdrawer_report')
  },
}
