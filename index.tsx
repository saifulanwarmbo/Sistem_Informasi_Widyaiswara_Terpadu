import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { WidyaiswaraProvider } from './contexts/WidyaiswaraContext';
import { CompetencyProvider } from './contexts/CompetencyContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
      <AuthProvider>
        <WidyaiswaraProvider>
          <CompetencyProvider>
            <App />
          </CompetencyProvider>
        </WidyaiswaraProvider>
      </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);