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
      CREATE TABLE customer_transaction (
      ct_id INT NOT NULL AUTO_INCREMENT,
      ct_customer_id INT NOT NULL,
      ct_sales_id VARCHAR(300) NOT NULL,
      ct_status ENUM('buy', 'refund', 'cancel') NOT NULL,
      ct_create_at VARCHAR(20) NOT NULL,
      PRIMARY KEY (ct_id),
      INDEX customer_transaction_fk_1_idx (ct_customer_id ASC) VISIBLE,
      INDEX customer_transaction_fk_2_idx (ct_sales_id ASC) VISIBLE,
      CONSTRAINT customer_transaction_fk_1
        FOREIGN KEY (ct_customer_id)
        REFERENCES customer_info (ci_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT customer_transaction_fk_2
        FOREIGN KEY (ct_sales_id)
        REFERENCES sales_detail (st_detail_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
`)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('customer_transaction')
  },
}
