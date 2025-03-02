'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('pos_config', {
      pc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pc_pos_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_pos',
          key: 'mp_posid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      pc_pos_printer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pc_production_kitchen_printer_ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pc_paper_size: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pc_printer_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pc_isblutooth: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      pc_isprinter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      pc_iscashdrawer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      pc_issync: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('pos_config')
  },
}
