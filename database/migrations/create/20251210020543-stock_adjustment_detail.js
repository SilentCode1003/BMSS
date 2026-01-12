'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'stock_adjustment_detail',
      {
        sad_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sad_branchid: {
          type: Sequelize.STRING(5),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        sad_details: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        sad_reason: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        sad_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sad_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        sad_notes: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        sad_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sad_attachments: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_adjustment_detail')
  },
}
