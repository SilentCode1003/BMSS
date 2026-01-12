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

    await queryInterface.bulkInsert('master_access_type', [
      {
        mat_accessname: 'Owner',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
      },
      {
        mat_accessname: 'Manager',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
      },
      {
        mat_accessname: 'User',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
      },
      {
        mat_accessname: 'Accounting',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
      },
      {
        mat_accessname: 'Production',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
      },
      {
        mat_accessname: 'Procurement',
        mat_status: 'ACTIVE',
        mat_createdby: 'Joseph Orencio',
        mat_createddate: '2025-06-21 08:55:00',
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

    await queryInterface.bulkDelete('master_access_type', null, {})
  },
}
