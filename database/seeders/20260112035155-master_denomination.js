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

    await queryInterface.bulkInsert('master_denomination', [
      {
        md_id: 1,
        md_code: '1PC',
        md_description: '1 Peso Coin',
        md_value: 1.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 2,
        md_code: '5PC',
        md_description: '5 Peso Coin',
        md_value: 5.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 3,
        md_code: '10PC',
        md_description: '10 Peso Coin',
        md_value: 10.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 4,
        md_code: '20PC',
        md_description: '20 Peso Coin',
        md_value: 20.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 5,
        md_code: '20PB',
        md_description: '20 Peso Bill',
        md_value: 20.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 6,
        md_code: '50PB',
        md_description: '50 Peso Bill',
        md_value: 50.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 7,
        md_code: '100PB',
        md_description: '100 Peso Bill',
        md_value: 100.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 8,
        md_code: '200PB',
        md_description: '200 Peso Bill',
        md_value: 200.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 9,
        md_code: '500PB',
        md_description: '500 Peso Bill',
        md_value: 500.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
      },
      {
        md_id: 10,
        md_code: '1000PB',
        md_description: '1000 Peso Bill',
        md_value: 1000.0,
        md_status: 'ACTIVE',
        md_create_by: 'SYSTEM',
        md_create_date: '2026-01-12 03:51:55',
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
    await queryInterface.bulkDelete('master_denomination', null, {})
  },
}
