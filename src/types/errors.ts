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

export class PostgresError extends Error implements DatabaseError {
  type: DatabaseErrorType;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;

  constructor(error: any) {
    super(error.message);
    this.name = 'PostgresError';
    this.type = mapErrorTypeFromPgError(error);
    this.code = error.code;
    this.detail = error.detail;
    this.hint = error.hint;
    this.position = error.position;
  }
}

function mapErrorTypeFromPgError(error: any): DatabaseErrorType {
  // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  const code = error.code;
  
  if (!code) return 'QUERY_ERROR';
  
  // Class 08 — Connection Exception
  if (code.startsWith('08')) return 'CONNECTION_ERROR';
  
  // Class 28 — Invalid Authorization Specification
  if (code.startsWith('28')) return 'AUTHENTICATION_ERROR';
  
  // Class 42 — Syntax Error or Access Rule Violation
  if (code.startsWith('42')) {
    return code === '42601' ? 'SYNTAX_ERROR' : 'PERMISSION_ERROR';
  }
  
  // Class 23 — Integrity Constraint Violation
  if (code.startsWith('23')) return 'CONSTRAINT_ERROR';
  
  return 'QUERY_ERROR';
}
