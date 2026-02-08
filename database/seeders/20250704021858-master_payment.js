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

    await queryInterface.bulkInsert('master_payment', [
      {
        mp_paymentname: 'GCASH',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'BANK TRANSFER',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'MAYA',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'SHOPEE',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'SHOPIFY',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'DEBIT CARD',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'CREDIT CARD',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
      },
      {
        mp_paymentname: 'TIKTOK SHOP',
        mp_status: 'ACTIVE',
        mp_createdby: 'DEV42',
        mp_createddate: '2025-07-04 10:18:00',
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

    await queryInterface.bulkDelete('master_payment', null, {})
  },
}
