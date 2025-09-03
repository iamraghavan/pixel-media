
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2'; // Import mysql2
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule: mysql2, // Explicitly use the mysql2 library
    logging: false, // Set to console.log to see SQL queries
  }
);

export default sequelize;
