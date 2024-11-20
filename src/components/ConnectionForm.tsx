import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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
      <div className="space-y-2">
        <Label htmlFor="name">Connection Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="host">Host</Label>
        <Input
          id="host"
          type="text"
          value={formData.host}
          onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="port">Port</Label>
        <Input
          id="port"
          type="number"
          value={formData.port}
          onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>
        <Input
          id="database"
          type="text"
          value={formData.database}
          onChange={(e) => setFormData({ ...formData, database: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password (Optional)</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="ssl"
          type="checkbox"
          checked={formData.ssl}
          onChange={(e) => setFormData({ ...formData, ssl: e.target.checked })}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="ssl">Use SSL</Label>
      </div>

      <Button type="submit" className="w-full">
        Connect
      </Button>
    </form>
  );
}
