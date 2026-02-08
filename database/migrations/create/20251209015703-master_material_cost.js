'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'master_material_cost',
      {
        mmc_materialid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        mmc_materialname: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mmc_unitcost: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mmc_unit: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mmc_status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
        },
        mmc_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        mmc_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1000 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('master_material_cost')
  },
}
