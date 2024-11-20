import { Editor } from '@monaco-editor/react';
import { Button } from './ui/button';
import { QueryResult, BaseRow } from '@/types/database';
import { editor } from 'monaco-editor';

interface SQLEditorProps {
  onExecuteQuery: (query: string) => Promise<void>;
  queryResult?: QueryResult;
  isLoading?: boolean;
}

export function SQLEditor({ onExecuteQuery, queryResult, isLoading }: SQLEditorProps) {
  const handleExecute = async () => {
    const editorValue = window.editor?.getValue();
    if (editorValue) {
      await onExecuteQuery(editorValue);
    }
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    window.editor = editor;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] gap-4">
      <div className="flex-1 min-h-[400px] border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="sql"
          defaultValue="-- Write your SQL query here"
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
          onMount={handleEditorMount}
        />
      </div>
      
      <div className="flex items-center justify-between px-4">
        <Button 
          onClick={handleExecute}
          disabled={isLoading}
          className="w-32"
        >
          {isLoading ? 'Executing...' : 'Execute Query'}
        </Button>
      </div>

      <div className="flex-1 border rounded-lg p-4 overflow-auto min-h-[300px]">
        {queryResult?.error ? (
          <div className="text-red-500">{queryResult.error}</div>
        ) : queryResult?.rows ? (
          <table className="min-w-full">
            <thead>
              <tr>
                {queryResult.columns.map((column, i) => (
                  <th key={i} className="px-4 py-2 text-left border-b">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.rows.map((row: BaseRow, i) => (
                <tr key={i}>
                  {queryResult.columns.map((column, j) => (
                    <td key={j} className="px-4 py-2 border-b">
                      {JSON.stringify(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500">Execute a query to see results</div>
        )}
      </div>
    </div>
  );
}
