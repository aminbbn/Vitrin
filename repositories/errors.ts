export type RepositoryErrorCode = 'NOT_FOUND' | 'CONFLICT' | 'FORBIDDEN' | 'INVALID_STATE' | 'STORAGE_FAILURE';

export class RepositoryError extends Error {
  constructor(public code: RepositoryErrorCode, message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}
