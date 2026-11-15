// Drizzle's migrations import .sql files, which babel-plugin-inline-import turns into strings.
declare module '*.sql' {
  const sql: string;
  export default sql;
}
