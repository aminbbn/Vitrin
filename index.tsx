import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/ThemeProvider';
import { RepositoryProvider } from './data/RepositoryProvider';
import { AppSessionProvider } from './data/useRepositories';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RepositoryProvider>
        <AppSessionProvider>
          <App />
        </AppSessionProvider>
      </RepositoryProvider>
    </ThemeProvider>
  </React.StrictMode>
);
