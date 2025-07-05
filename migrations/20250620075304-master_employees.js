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
      `CREATE TABLE master_employees (
        me_employeeid int NOT NULL AUTO_INCREMENT,
        me_fullname varchar(300) NOT NULL,
        me_position int NOT NULL,
        me_contactinfo varchar(300) NOT NULL,
        me_datehired varchar(20) NOT NULL,
        me_status varchar(300) NOT NULL,
        me_createdby varchar(300) NOT NULL,
        me_createddate varchar(20) NOT NULL,
        PRIMARY KEY (me_employeeid),
        KEY master_position_master_employee_idx (me_position),
        CONSTRAINT me_position_mp_positioncode FOREIGN KEY (me_position) REFERENCES master_position_type (mpt_positioncode)
      ) ENGINE=InnoDB AUTO_INCREMENT=200000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('master_employees')
  },
}
