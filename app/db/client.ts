import { Pool, PoolConfig } from "pg";

const config = (
  process.env.NODE_ENV === "production"
    ? {
        host: "localhost",
        user: "root",
        password: "rootpassword",
        port: 5432,
        database: "postgres",
      }
    : {
        connectionString: process.env.DATABASE_URL,
      }
) satisfies PoolConfig;

// Create a PostgreSQL connection pool
export const pool = new Pool(config);
