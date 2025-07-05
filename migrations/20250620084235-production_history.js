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

    await queryInterface.sequelize.query(`
      CREATE TABLE production_history (
        ph_historyid int NOT NULL AUTO_INCREMENT,
        ph_productionid int NOT NULL,
        ph_quantity int NOT NULL,
        ph_date varchar(20) NOT NULL,
        ph_status varchar(20) NOT NULL,
        PRIMARY KEY (ph_historyid),
        KEY ph_productionid (ph_productionid),
        CONSTRAINT production_history_ibfk_1 FOREIGN KEY (ph_productionid) REFERENCES production (p_productionid)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_history')
  },
}
