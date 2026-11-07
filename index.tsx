import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AlertProvider } from './context/AlertContext';
import SWManager from './components/SWManager';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

createRoot(rootElement).render(
  <StrictMode>
    <AlertProvider>
      <SWManager />
      <App />
    </AlertProvider>
  </StrictMode>
);