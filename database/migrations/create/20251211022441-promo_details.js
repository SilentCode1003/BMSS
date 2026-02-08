'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'promo_details',
      {
        pd_promoid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pd_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pd_description: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pd_dtipermit: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pd_condition: {
          type: Sequelize.TEXT('long'),
          allowNull: false,
        },
        pd_startdate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pd_enddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pd_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pd_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pd_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('promo_details')
  },
}
