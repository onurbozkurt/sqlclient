'use client';

import { useState } from 'react';
import { ConnectionForm } from '@/components/ConnectionForm';
import { SQLEditor } from '@/components/SQLEditor';
import { DatabaseConnection, QueryResult, BaseRow } from '@/types/database';
import { PostgresError } from '@/types/errors';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [connection, setConnection] = useState<DatabaseConnection | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult<BaseRow>>();
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
      const pgError = error instanceof PostgresError ? error : new PostgresError(error as Error);
      setQueryResult({
        command: '',
        columns: [],
        rows: [],
        rowCount: 0,
        fields: [],
        error: `${pgError.type}: ${pgError.message}${pgError.hint ? `\nHint: ${pgError.hint}` : ''}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">PostgreSQL Editor</h1>
          <ThemeToggle />
        </div>
        
        {!connection ? (
          <ConnectionForm onConnect={handleConnect} />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Connected to:</span>{' '}
                <span className="text-green-600 dark:text-green-400">{connection.name}</span>
              </div>
              <button
                onClick={() => setConnection(null)}
                className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
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
