import { NextResponse } from 'next/server';
import { Client, DatabaseError as PgDatabaseError } from 'pg';
import { DatabaseConnection, QueryResult } from '@/types/database';
import { PostgresError } from '@/types/errors';

interface QueryRequest {
  connection: DatabaseConnection;
  query: string;
}

export async function POST(request: Request) {
  let client: Client | null = null;
  
  try {
    const { connection, query } = await request.json() as QueryRequest;
    
    if (!connection || !query) {
      throw new Error('Missing required parameters: connection and query');
    }

    const clientConfig = {
      host: connection.host,
      port: connection.port,
      database: connection.database,
      user: connection.username,
      password: connection.password,
      ssl: connection.ssl ? { rejectUnauthorized: false } : false,
    };

    client = new Client(clientConfig);
    await client.connect();
    
    const result = await client.query(query);
    
    const queryResult: QueryResult = {
      command: result.command ?? '',
      columns: result.fields.map(field => field.name),
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
      fields: result.fields,
    };
    
    return NextResponse.json(queryResult);
    
  } catch (error) {
    // Handle PostgreSQL specific errors
    if (error instanceof PgDatabaseError) {
      const pgError = new PostgresError(error);
      return NextResponse.json(
        pgError,
        { status: 400 }
      );
    }
    
    // Handle connection and other errors
    const pgError = new PostgresError(
      error instanceof Error ? error : { message: 'Unknown error occurred' }
    );
    
    return NextResponse.json(
      pgError,
      { status: 500 }
    );
    
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', 
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }
  }
}
