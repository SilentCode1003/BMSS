'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transfer_order_items', {
      toi_itemid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      toi_transferid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'transfer_orders',
          key: 'to_transferid'
        }
      },
      toi_productid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'master_product',
          key: 'mp_productid'
        }
      },
      toi_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      toi_destinationStocks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
     
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('transfer_order_items')
  }
};
