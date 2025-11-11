// Database configuration file
// Currently not using Sequelize/Database ORM
// Uncomment when you're ready to use a database

/*
import { Sequelize } from 'sequelize';

const databaseConfig = {
    database: 'your_database_name',
    username: 'your_username',
    password: 'your_password',
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
};

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
});

export default sequelize;
*/

export const databaseConfig = {
    database: 'device_console',
    host: 'localhost',
    port: 3306,
};