'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'addon_type',
      {
       at_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
       at_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
       at_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
       at_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
       at_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addon_type')
  },
}
