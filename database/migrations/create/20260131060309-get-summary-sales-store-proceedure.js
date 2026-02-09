'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const procedureSQL = fs.readFileSync(
      path.join(__dirname, '../../sql/store_proceedure/GetSummarySales.sql'),
      'utf8'
    );
    await queryInterface.sequelize.query(procedureSQL);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS GetSummarySales;
    `);
  }
};
