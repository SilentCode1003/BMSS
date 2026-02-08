'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'purchase_order_items',
      {
        poi_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        poi_orderid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'purchase_order',
            key: 'po_orderid',
          },
        },
        poi_description: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        poi_quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        poi_unitprice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        poi_totalprice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 },
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_order_items')
  },
}
