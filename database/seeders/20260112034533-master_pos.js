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

    await queryInterface.bulkInsert('master_pos', [
      {
        mp_posid: 1,
        mp_posname: 'POS 1',
        mp_serial: 'KS23425',
        mp_min: '--',
        mp_ptu: '--',
        mp_status: 'ACTIVE',
        mp_createdby: 'SYSTEM',
        mp_createddate: '2026-01-12 03:45:33',
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

    await queryInterface.bulkDelete('master_pos', null, {})
  },
}
