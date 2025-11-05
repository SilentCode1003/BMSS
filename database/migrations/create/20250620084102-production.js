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
      CREATE TABLE production (
        p_productionid int NOT NULL AUTO_INCREMENT,
        p_productid int NOT NULL,
        p_startdate varchar(20) NOT NULL,
        p_enddate varchar(20) NOT NULL,
        p_quantityproduced int NOT NULL,
        p_productionline varchar(50) NOT NULL,
        p_supervisorid int NOT NULL,
        p_notes text NOT NULL,
        p_status varchar(20) NOT NULL,
        PRIMARY KEY (p_productionid),
        KEY p_productid (p_productid),
        KEY p_supervisorid (p_supervisorid),
        CONSTRAINT production_ibfk_1 FOREIGN KEY (p_productid) REFERENCES master_product (mp_productid),
        CONSTRAINT production_ibfk_2 FOREIGN KEY (p_supervisorid) REFERENCES master_employees (me_employeeid)
      ) ENGINE=InnoDB AUTO_INCREMENT=3207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

      `)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production')
  },
}
