'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'production_material_count',
      {
        pmc_countid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pmc_productid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'production_materials',
            key: 'mpm_productid',
          },
        },
        pmc_quantity: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        pmc_unit: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmc_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmc_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pmc_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pmc_updatedby: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('production_material_count')
  },
}
