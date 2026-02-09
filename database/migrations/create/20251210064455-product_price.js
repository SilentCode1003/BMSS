'use striccf'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'product_price',
      {
        pp_product_price_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        pp_product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_product',
            key: 'mp_productid',
          },
        },
        pp_description: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pp_barcode: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pp_product_image: {
          type: Sequelize.TEXT('long'),
          allowNull: true,
        },
        pp_price: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pp_category: {
          type: Sequelize.INTEGER,
          allowNull: false,
          foreignKey: true,
          references: {
            model: 'master_category',
            key: 'mc_categorycode',
          },
        },
        pp_previous_price: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        pp_price_change: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        pp_price_change_date: {
          type: Sequelize.STRING(300),
          allowNull: true,
        },
        pp_status: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        pp_createdby: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        pp_createddate: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
      },
      { initialAutoIncrement: 1 }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_price')
  },
}
