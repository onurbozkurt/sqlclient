import { useState } from 'react';
import { Button } from './ui/button';
import { DatabaseConnection } from '@/types/database';

interface ConnectionFormProps {
  onConnect: (connection: DatabaseConnection) => void;
}

export function ConnectionForm({ onConnect }: ConnectionFormProps) {
  const [formData, setFormData] = useState<Omit<DatabaseConnection, 'id'>>({
    name: '',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const connection = {
      ...formData,
      id: crypto.randomUUID(),
      // Only include password if it's not empty
      password: formData.password || undefined
    };
    onConnect(connection);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Connection Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Host</label>
        <input
          type="text"
          value={formData.host}
          onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Port</label>
        <input
          type="number"
          value={formData.port}
          onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Database</label>
        <input
          type="text"
          value={formData.database}
          onChange={(e) => setFormData({ ...formData, database: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password (Optional)</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.ssl}
          onChange={(e) => setFormData({ ...formData, ssl: e.target.checked })}
          className="mr-2"
        />
        <label className="text-sm font-medium">Use SSL</label>
      </div>

      <Button type="submit" className="w-full">
        Connect
      </Button>
    </form>
  );
}
