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

    await queryInterface.bulkInsert('master_employees', [
      {
        me_fullname: 'Lorna Co Bagapuro',
        me_position: 1000,
        me_contactinfo: 'N/A',
        me_datehired: '2025-06-21',
        me_status: 'ACTIVE',
        me_createdby: 'Joseph Orencio',
        me_createddate: '2025-06-21 08:55:00',
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

    await queryInterface.bulkDelete('master_employee', null, {})
  },
}
