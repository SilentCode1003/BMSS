'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'pos_config',
      {
        pc_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pc_pos_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        pc_pos_printer: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pc_production_kitchen_printer_ip: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pc_paper_size: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pc_printer_name: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pc_isblutooth: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        pc_isprinter: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        pc_iscashdrawer: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
        pc_issync: {
          type: Sequelize.TINYINT,
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pos_config')
  },
}
