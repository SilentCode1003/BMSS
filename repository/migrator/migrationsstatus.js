const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
require('dotenv').config();
const { DecryptString } = require('../helper/cryptography');

(async () => {
  try {
    const sequelize = new Sequelize(
      process.env._DATABASE,
      process.env._USER,
      DecryptString(process.env._PASSWORD),
      {
        host: process.env._HOST,
        dialect: 'mysql',
      }
    );

    const migrator = new Umzug({
        storage: new SequelizeStorage({ sequelize: sequelize }),
        migrations: { glob: '../migrations/*.js' },
        context: sequelize.getQueryInterface(),
        logger: console,
      });

    const executedMigrations = await migrator.executed();
    const pendingMigrations = await migrator.pending();

    const allMigrations = [
      ...executedMigrations.map((migration) => ({
        Name: migration.file,
        Status: 'up',
      })),
      ...pendingMigrations.map((migration) => ({
        Name: migration.file,
        Status: 'down',
      })),
    ];

    console.table(allMigrations);

    await sequelize.close();
  } catch (error) {
    console.error('Error fetching migration status:', error);
  }
})();
