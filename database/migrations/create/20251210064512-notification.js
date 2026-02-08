'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'notification',
      {
        n_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        n_userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_user',
            key: 'mu_usercode',
          },
        },
        n_inventoryid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'product_inventory',
            key: 'pi_inventoryid',
          },
        },
        n_branchid: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        n_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        n_message: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        n_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        n_checker: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        n_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notification')
  },
}
