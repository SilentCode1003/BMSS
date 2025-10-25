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

    await queryInterface.bulkInsert('master_branch', [
      {
        mb_branchid: '001',
        mb_branchname: 'ZhyRille Pacita',
        mb_tin: '000-000-000-000',
        mb_address: '39 Macaria Avenue, San Francisco, Biñan, Laguna',
        mb_logo: 'N/A',
        mb_status: 'ACTIVE',
        mb_createdby: 'Joseph Orencio',
        mb_createddate: '2025-06-21 08:55:00',
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

    await queryInterface.bulkDelete('master_branch', null, {})
  },
}
