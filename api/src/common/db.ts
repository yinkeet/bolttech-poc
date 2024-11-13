import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'dev',
});