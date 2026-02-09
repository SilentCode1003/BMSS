'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_materials',
      {
        mpm_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mpm_productname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mpm_description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        mpm_category: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_category',
            key: 'mc_categorycode',
          },
        },
        mpm_vendorid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_vendor',
            key: 'mv_vendorid',
          },
        },
        mpm_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        mpm_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        mpm_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mpm_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_materials')
  },
}
