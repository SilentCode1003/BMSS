'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('master_user', [
      {
        mu_employeeid: 200000,
        mu_accesstype: 1000,
        mu_status: 'ACTIVE',
        mu_username: 200000,
        mu_password: '7eed2be7d63c40a48cc24ba3afc533b7',
        mu_branchid: '001',
        mu_createdby: 'Joseph Orencio',
        mu_createddate: '2025-06-21 08:55:00',
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('master_user', null, {})
  }
};
