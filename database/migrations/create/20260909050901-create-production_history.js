'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('production_history', {
      ph_historyid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ph_productionid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'production',
          key: 'p_productionid'
        }
      },
      ph_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ph_date: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      ph_status: {
        type: Sequelize.STRING(20),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('production_history')
  }
};
