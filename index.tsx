import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { WidyaiswaraProvider } from './contexts/WidyaiswaraContext';
import { CompetencyProvider } from './contexts/CompetencyContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

console.log('INDEX.TSX EXECUTED');
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
      <ToastProvider>
      <AuthProvider>
        <WidyaiswaraProvider>
          <CompetencyProvider>
            <App />
          </CompetencyProvider>
        </WidyaiswaraProvider>
      </AuthProvider>
      </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);