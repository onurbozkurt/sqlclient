import { DatabaseError as PgDatabaseError } from 'pg';

export type DatabaseErrorType = 
  | 'CONNECTION_ERROR'
  | 'QUERY_ERROR'
  | 'NETWORK_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'PERMISSION_ERROR'
  | 'SYNTAX_ERROR'
  | 'CONSTRAINT_ERROR';

export interface DatabaseError extends Error {
  type: DatabaseErrorType;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
}

interface ErrorLike {
  message: string;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
}

export class PostgresError extends Error implements DatabaseError {
  type: DatabaseErrorType;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;

  constructor(error: PgDatabaseError | Error | ErrorLike) {
    super(error.message);
    this.name = 'PostgresError';
    
    // Copy over properties if they exist
    if ('code' in error) this.code = error.code;
    if ('detail' in error) this.detail = error.detail;
    if ('hint' in error) this.hint = error.hint;
    if ('position' in error) this.position = error.position;
    
    this.type = this.code ? mapErrorTypeFromPgError(this.code) : 'QUERY_ERROR';
  }
}

function mapErrorTypeFromPgError(code: string): DatabaseErrorType {
  // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  // Class 08 — Connection Exception
  if (code.startsWith('08')) return 'CONNECTION_ERROR';
  
  // Class 28 — Invalid Authorization Specification
  if (code.startsWith('28')) return 'AUTHENTICATION_ERROR';
  
  // Class 42 — Syntax Error or Access Rule Violation
  if (code === '42601') return 'SYNTAX_ERROR';
  if (code.startsWith('42')) return 'PERMISSION_ERROR';
  
  // Class 23 — Integrity Constraint Violation
  if (code.startsWith('23')) return 'CONSTRAINT_ERROR';
  
  // Network errors
  if (code.startsWith('XX')) return 'NETWORK_ERROR';
  
  return 'QUERY_ERROR';
}
