'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_deposit_slip_sales', {
      cdss_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      cdss_branch_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        references: {
          model: 'master_branch',
          key: 'mb_branchid',
        },
      },
      cdss_pos_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_pos',
          key: 'mp_posid',
        },
      },
      cdss_sales_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        references: {
          model: 'sales_detail',
          key: 'st_detail_id',
        },
      },
      cdss_bank_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cdss_account_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      cdss_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      cdss_status: {
        type: Sequelize.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cash_deposit_slip_sales');
  }
};
