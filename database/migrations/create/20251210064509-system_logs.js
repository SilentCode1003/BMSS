'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'system_logs',
      {
        sl_logid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        sl_logdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sl_loglevel: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        sl_source: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        sl_message: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        sl_userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_user',
            key: 'mu_usercode',
          },
        },
        sl_ipaddress: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('system_logs')
  },
}
