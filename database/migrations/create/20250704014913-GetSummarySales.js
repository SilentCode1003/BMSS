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
          CREATE DEFINER='root'@'%' PROCEDURE GetSummarySales(
              IN startdate VARCHAR(20),
              IN enddate VARCHAR(20),
              IN branch VARCHAR(6),
              IN salesstatus VARCHAR(20)
          )
          BEGIN

            -- insert sales items
            CREATE TEMPORARY TABLE salesdata  AS
            SELECT 
            CASE WHEN SUM(si_quantity * si_price) < 0 THEN COALESCE(dd_description, mp_description) 
            ELSE mp_description 
            END AS item,
            CASE 
            WHEN SUM(si_quantity * si_price) < 0 THEN 'Discounts & Promo' 
            ELSE mc_categoryname 
            END AS category,
            SUM(si_quantity) AS quantity,
            CASE WHEN SUM(si_quantity * si_price) < 0 THEN 0 else si_price END AS price,
            SUM(si_quantity * si_price) AS total
            FROM sales_detail
            INNER JOIN sales_item ON st_detail_id = si_detail_id
            INNER JOIN master_product ON si_item = mp_productid
            INNER JOIN master_category ON mc_categorycode = mp_category
            LEFT JOIN discounts_details ON dd_discountid = si_item
            WHERE st_date BETWEEN startdate AND enddate
              AND st_status = salesstatus
            AND (CASE WHEN branch = '0' THEN st_branch IN(SELECT mb_branchid FROM master_branch) ELSE st_branch = branch END)
            GROUP BY mp_description, dd_description, mc_categoryname
            ORDER BY total DESC;
              
              -- insert dsales discount
              IF((SELECT COUNT(*) FROM sales_discount) != 0) THEN
              INSERT INTO salesdata(item, category, quantity, price, total)
              SELECT
                dd_name AS item,
                'Discount' AS category,
                COUNT(*) AS quantity,
                0 AS price, -- Discounts have no price
                IFNULL(SUM(sd_amount), 0) AS total -- Default to 0 if NULL
              FROM sales_discount
              INNER JOIN sales_detail ON st_detail_id = sd_detailid
              INNER JOIN discounts_details ON dd_discountid = sd_discountid
              WHERE st_date BETWEEN startdate AND enddate
              AND st_status = salesstatus
              AND (CASE WHEN branch = '0' THEN st_branch IN(SELECT mb_branchid FROM master_branch) ELSE st_branch = branch END)
              GROUP BY dd_name;

              END IF;
              
              SELECT * FROM salesdata;
              DROP TABLE salesdata;
          END`
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.sequelize.query(
      `
      DROP PROCEDURE GetSummarySales;
      `
    )
  },
}
