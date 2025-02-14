'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('cash_drop', {
      cd_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_user',
          key: 'mu_usercode',
        },
      },
      cd_datetime: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      cd_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('cash_drop')
  },
}
