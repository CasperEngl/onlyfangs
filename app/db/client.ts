import mysql from "mysql2/promise";

const config =
  process.env.NODE_ENV === "production"
    ? {
        host: "localhost",
        user: "root",
        password: "rootpassword",
        port: 3306,
        database: "onlyfangs",
      }
    : {
        uri: process.env.DATABASE_URL,
        database: "onlyfangs",
        connectionLimit: 10,
      };

// Create a MySQL connection pool
export const pool = mysql.createPool(config);
