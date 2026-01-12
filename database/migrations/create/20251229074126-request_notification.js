'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'request_notification',
      {
        rn_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        rn_type: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        rn_userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_user',
            key: 'mu_usercode',
          },
        },
        rn_branchid: {
          type: Sequelize.STRING(20),
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_branch',
            key: 'mb_branchid',
          },
        },
        rn_message: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        rn_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        rn_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('request_notification')
  },
}
