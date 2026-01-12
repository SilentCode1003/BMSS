'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales_purchase_order', {
      ct_reference_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        primaryKey: true,
      },
      ct_sales_id: {
        type: Sequelize.STRING(300),
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'sales_detail',
          key: 'st_detail_id',
        },
      },
      ct_branch_id: {
        type: Sequelize.STRING(5),
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'master_branch',
          key: 'mb_branchid',
        },
      },
      ct_pos_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'master_pos',
          key: 'mp_posid',
        },
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales_purchase_order')
  },
}
