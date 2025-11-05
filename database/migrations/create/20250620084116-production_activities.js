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
      CREATE TABLE production_activities (
        pa_activityid int NOT NULL AUTO_INCREMENT,
        pa_productionid int NOT NULL,
        pa_activityname varchar(100) NOT NULL,
        pa_startdate varchar(20) NOT NULL,
        pa_enddate varchar(20) NOT NULL,
        pa_workerid int NOT NULL,
        PRIMARY KEY (pa_activityid),
        KEY pa_productionid (pa_productionid),
        CONSTRAINT production_activities_ibfk_1 FOREIGN KEY (pa_productionid) REFERENCES production (p_productionid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('production_activities')
  },
}
