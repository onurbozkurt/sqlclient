import { QueryResult as PgQueryResult, FieldDef } from 'pg';

export interface DatabaseConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  ssl: boolean;
}

// Define possible SQL value types
export type SQLValue = string | number | boolean | Date | Buffer | null;

// Define a base row type that ensures all values are SQL-compatible
export type BaseRow = Record<string, SQLValue>;

export interface QueryResultBase {
  command?: string;
  rowCount: number;
  fields: FieldDef[];
}

// Make the QueryResult generic but constrain it to SQL-compatible types
export interface QueryResult<R extends BaseRow = BaseRow> extends QueryResultBase {
  columns: string[];
  rows: R[];
  error?: string;
}

// Extend PostgreSQL's QueryResult with our row constraints
export type DatabaseQueryResult<R extends BaseRow = BaseRow> = PgQueryResult<R>;
