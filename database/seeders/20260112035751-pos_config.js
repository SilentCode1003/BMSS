'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('pos_config', [
      {
        pc_id: 1,
        pc_pos_id: 1,
        pc_pos_printer: '192.168.40.12',
        pc_production_kitchen_printer_ip: '192.168.40.12',
        pc_paper_size: '80mm',
        pc_printer_name: 'HRPT TP808S',
        pc_isblutooth: 0,
        pc_isprinter: 0,
        pc_iscashdrawer: 0,
        pc_issync: 0,
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('pos_config', null, {})
  },
}
