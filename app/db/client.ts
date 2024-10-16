import mysql from "mysql2/promise";

// Create a MySQL connection pool
export const pool = mysql.createPool(
  process.env.NODE_ENV === "production"
    ? {
        user: "root",
        password: "rootpassword",
        port: 3306,
        database: "onlyfangs",
      }
    : {
        uri: process.env.DATABASE_URL,
        database: "onlyfangs",
        connectionLimit: 10,
      }
);
