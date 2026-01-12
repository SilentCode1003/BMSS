'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'cashdrawer_activity',
      {
        ca_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        ca_branch_id: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        ca_shift_number: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        ca_pos_id: {
          type: Sequelize.STRING(4),
          allowNull: false,
        },
        ca_shift_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ca_user_id: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        ca_datetime: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ca_description: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        ca_status: {
          type: Sequelize.ENUM(
            'cash',
            'split',
            'refund',
            'transaction',
            'discount',
            'promo',
            'other',
            'cashdrop',
            'startshift',
            'endshift',
            'open'
          ),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cashdrawer_activity')
  },
}
