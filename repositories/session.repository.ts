import { AppSession } from '../domain';

export interface SessionRepository {
  getSession(): Promise<AppSession | null>;
  signInMock(password: string): Promise<AppSession>;
  signOut(): Promise<void>;
  subscribe(listener: (session: AppSession | null) => void): () => void;
}
