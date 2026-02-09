'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_product',
      {
        mp_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mp_description: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_price: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_category: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_category',
            key: 'mc_categorycode',
          },
        },
        mp_barcode: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_productimage: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        mp_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mp_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mp_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        mp_cost:{
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        }
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_product')
  },
}
