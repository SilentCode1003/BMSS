'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('cashdrawer_report', {
      cr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      cr_cash_float_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cashdrawer_cash_float',
          key: 'ccf_id',
        },
      },
      cr_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cr_denomination: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('cashdrawer_report');
  }
};
