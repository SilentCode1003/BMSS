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
      CREATE TABLE epayment_details (
        ed_paymentid int NOT NULL AUTO_INCREMENT,
        ed_detailid varchar(300) NOT NULL,
        ed_type varchar(300) NOT NULL,
        ed_referenceid varchar(120) NOT NULL,
        ed_date varchar(20) NOT NULL,
        PRIMARY KEY (ed_paymentid),
        KEY ed_detailid (ed_detailid),
        CONSTRAINT epayment_details_ibfk_1 FOREIGN KEY (ed_detailid) REFERENCES sales_detail (st_detail_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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

    await queryInterface.dropTable('epayment_details')
  },
}
