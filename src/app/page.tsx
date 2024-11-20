'use client';

import { useState } from 'react';
import { ConnectionForm } from '@/components/ConnectionForm';
import { SQLEditor } from '@/components/SQLEditor';
import { DatabaseConnection, QueryResult } from '@/types/database';
import { PostgresError } from '@/types/errors';

export default function Home() {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult>();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = (newConnection: DatabaseConnection) => {
    setConnection(newConnection);
  };

  const handleExecuteQuery = async (query: string) => {
    if (!connection) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connection,
          query,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new PostgresError(result);
      }
      setQueryResult(result);
    } catch (error) {
      const pgError = error instanceof PostgresError ? error : new PostgresError(error);
      setQueryResult({
        columns: [],
        rows: [],
        rowCount: 0,
        error: `${pgError.type}: ${pgError.message}${pgError.hint ? `\nHint: ${pgError.hint}` : ''}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-8">PostgreSQL Editor</h1>
        
        {!connection ? (
          <ConnectionForm onConnect={handleConnect} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Connected to:</span>{' '}
                <span className="text-green-600">{connection.name}</span>
              </div>
              <button
                onClick={() => setConnection(null)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>
            
            <SQLEditor
              onExecuteQuery={handleExecuteQuery}
              queryResult={queryResult}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
