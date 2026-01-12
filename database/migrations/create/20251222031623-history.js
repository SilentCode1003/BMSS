'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'history',
      {
        h_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        h_branch: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        h_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        h_date: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        h_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        h_inventoryid: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        h_movementid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        h_type: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        h_stocksafter: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('history')
  },
}
