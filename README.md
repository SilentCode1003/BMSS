# BMSS

- Branch Management Sales System
- BMSS is a web application that manages sales and inventory for a branch. It is designed to be used by a sales manager or a branch manager to manage sales and inventory.
- The application is built using Node.js and Express.js. It uses MySQL as the database and Bootstrap for the front-end.
- The application is designed to be scalable and can handle a large number of sales and inventory records.
- The application is designed to be secure and uses JWT for authentication and authorization.
- The application is designed to be customizable and can be extended with additional features.

## Features

- Sales Management
  - Sales Orders
    - Create, view, edit, and delete sales orders
    - Generate PDF reports for sales orders
  - Purchase Orders
    - Create, view, edit, and delete purchase orders
    - Generate PDF reports for purchase orders
  - Production
    - Create, view, edit, and delete production orders
    - Generate PDF reports for production orders
- Inventory Management
  - Materials
    - Create, view, edit, and delete materials
    - Generate PDF reports for materials
  - Production Materials
    - Create, view, edit, and delete production materials
    - Generate PDF reports for production materials
  - Production Material Count
    - Create, view, edit, and delete production material counts
    - Generate PDF reports for production material counts
  - Sales History
    - View sales history for sales orders, purchase orders, and production orders
    - Generate PDF reports for sales history
  - Purchase Order Items
    - View purchase order items
    - Generate PDF reports for purchase order items
  - Production History
    - View production history for production orders
    - Generate PDF reports for production history
  - Material History
    - View material history for materials and production materials
    - Generate PDF reports for material history
- Reporting
  - Sales Report
    - Generate PDF reports for sales reports
  - Purchase Order Report
    - Generate PDF reports for purchase order reports
  - Production Report
    - Generate PDF reports for production reports
  - Material Report
    - Generate PDF reports for material reports
- Payroll
  - Employee Payroll
    - Generate PDF reports for employee payroll
  - Branch Payroll
    - Generate PDF reports for branch payroll
- Finance
  - Cash Flow
    - Generate PDF reports for cash flow
  - Profit and Loss
    - Generate PDF reports for profit and loss
  - Balance Sheet
    - Generate PDF reports for balance sheet
  - Income Statement
    - Generate PDF reports for income statement

## Installation

1. Clone the repository
2. Install the required dependencies using npm
3. Create a .env file in the root directory and add the necessary configuration details
4. Run the application using node app.js

## Configuration

The application requires the following configuration details:

- \_HOST: The hostname or IP address of the MySQL server
- \_USER: The username for the MySQL server
- \_PASSWORD: The password for the MySQL server
- \_DATABASE: The name of the database to connect to
- \_TITLE: The title of the application

## Usage

The application provides a web-based user interface for managing sales and inventory. It includes various features for managing sales, inventory, and reporting. The application is designed to be used by a sales manager or a branch manager to manage sales and inventory.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please feel free to submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Contact

For any questions or concerns, please contact the author at [j0s3ph0r3nc10@gmail.com](mailto:j0s3ph0r3nc10@gmail.com).

## npm scripts

- "sequelize:init": "sequelize init",
- "db:setup": "node ./database/utility/db.setup.js",
- "db:status": "node ./database/utility/checkmigrations.js",
- "db:migrate": "npx sequelize-cli db:migrate && node database/utility/generateModels.js",
- "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
- "db:seed:undo": "npx sequelize-cli db:seed:undo:all",
- "db:drop": "node settings/reset_confirmation.js \"⚠️ WARNING: This will DROP the database. Type 'yes' to continue: \" && npx sequelize-cli db:drop",
- "db:create": "npx sequelize-cli db:create",
- "db:seed": "npx sequelize-cli db:seed:all",
- "db:reset": "node settings/reset_confirmation.js \"⚠️ WARNING: This will RESET the database. Type 'yes' to continue: \" && npm run db:drop && npm run db:create && npm run db:migrate && npm run db:seed",
- "env:setup": "node settings/setup_env.js",
- "db:migrate:prod": "npx sequelize-cli db:migrate --migrations-path database/migrations/alter && node database/utility/generateModels.js",
- "db:migrate:prod:undo": "npx sequelize-cli db:migrate:undo --migrations-path database/migrations/alter"

# Versions

### Version 1.0.5

- Added cash report feature
- Added denomination report feature
- Added cash drawer report feature

### Version 1.0.6

- Added cash drop feature
- Added cash drawer cash float feature
- Added cash drawer report feature
- Added cash drawer activity feature
- Added Sold Items Report feature

### Version 1.0.6

- Added Sold Items Report feature

### Version 1.0.8

- fix get sales details
- fix split e-payment
- fix load of split payment for mobile

### Version 1.0.9

- fix purchase order report
- added validation on report and complete of purchase order

### Version 1.0.10

- added advanced search for product inventory

### Version 2.0.0

- added item to sold service
- added item to sold package
- package item deduct on sales inventory
- added services and packages count in total sales

### Version 2.5.1

- added customer transaction
- added customer
- service and package item count in sales details

### Version 2.6.1

- added filter of type on material history page
- added view customer transaction on customer page

### Version 3.0.0

- added routes and access routes entry
- added isShow on master category

### Version 3.1.0

- added employee sales bar graph
- added bulk price update

### Version 3.2.0

- added employee sales graph