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
      CREATE TABLE sales_detail (
        st_detail_id varchar(300) NOT NULL,
        st_date varchar(20) NOT NULL,
        st_pos_id varchar(300) NOT NULL,
        st_shift varchar(300) NOT NULL,
        st_payment_type varchar(300) NOT NULL,
        st_description longtext NOT NULL,
        st_total varchar(300) NOT NULL,
        st_cashier varchar(300) NOT NULL,
        st_branch varchar(5) DEFAULT NULL,
        st_status varchar(20) NOT NULL,
        PRIMARY KEY (st_detail_id),
        KEY st_branch_idx (st_branch),
        CONSTRAINT st_branch FOREIGN KEY (st_branch) REFERENCES master_branch (mb_branchid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('sales_detail')
  },
}
