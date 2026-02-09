'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'addon',
      {
        a_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        a_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        a_type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'addon_type',
            key: 'at_id',
          },
        },
        a_price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        a_isproduct: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        a_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        a_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        a_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addon')
  },
}
