'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'package',
      {
        p_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        p_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        p_details: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        p_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        p_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        p_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        p_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('package')
  },
}
