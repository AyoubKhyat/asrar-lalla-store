import postgres from "postgres";

let _sql: ReturnType<typeof postgres> | null = null;

export function sql() {
  if (_sql) return _sql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  _sql = postgres(connectionString, { ssl: "prefer" });
  return _sql;
}
