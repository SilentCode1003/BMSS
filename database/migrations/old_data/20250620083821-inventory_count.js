'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.query(
      `
      CREATE TABLE inventory_count (
        ic_countid int NOT NULL AUTO_INCREMENT,
        ic_count_date varchar(20) NOT NULL,
        ic_locationid int NOT NULL,
        ic_countby varchar(50) NOT NULL,
        ic_countverification varchar(50) NOT NULL,
        ic_notes text NOT NULL,
        PRIMARY KEY (ic_countid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('inventory_count')
  },
}
