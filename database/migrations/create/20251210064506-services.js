'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'services',
      {
        s_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        s_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        s_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        s_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        s_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        s_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('service')
  },
}
