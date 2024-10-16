import mysql from "mysql2/promise";

// Create a MySQL connection pool
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  database: "onlyfangs",
  connectionLimit: 10,
});
