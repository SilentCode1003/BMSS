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
      CREATE TABLE inventory_valuation_report (
        ivr_reportid int NOT NULL AUTO_INCREMENT,
        ivr_reportdate varchar(20) NOT NULL,
        ivr_generateby int NOT NULL,
        ivr_notes text NOT NULL,
        PRIMARY KEY (ivr_reportid),
        KEY ivr_generateby (ivr_generateby),
        CONSTRAINT inventory_valuation_report_ibfk_1 FOREIGN KEY (ivr_generateby) REFERENCES master_employees (me_employeeid)
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

    await queryInterface.dropTable('inventory_valuation_report')
  },
}
