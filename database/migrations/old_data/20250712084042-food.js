'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.query(`
      CREATE TABLE food (
      f_id INT NOT NULL AUTO_INCREMENT,
      f_category_id INT NOT NULL,
      f_image LONGTEXT NULL,
      f_price DECIMAL(10,2) NOT NULL,
      f_status ENUM('active', 'inactive') NOT NULL,
      f_create_at VARCHAR(20) NOT NULL,
      f_create_by VARCHAR(300) NOT NULL,
      PRIMARY KEY (f_id),
      INDEX food_fk_1_idx (f_category_id ASC) VISIBLE,
      CONSTRAINT food_fk_1
        FOREIGN KEY (f_category_id)
        REFERENCES food_category (fc_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
      `);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('food');
  }
};
