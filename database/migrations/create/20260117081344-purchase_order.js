'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'purchase_order',
      {
        po_orderid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        po_vendorid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_vendor',
            key: 'mv_vendorid',
          },
        },
        po_orderdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        po_deliverydate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        po_total_amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        po_paymentterms: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        po_deliverymethod: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        po_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 },
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('purchase_order')
  },
}
