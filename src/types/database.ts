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

export interface QueryResult {
  columns: string[];
  rows: any[];
  rowCount: number;
  error?: string;
}
