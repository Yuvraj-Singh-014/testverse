import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #00ff88',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#00ff88', secondary: '#0a0a0a' },
          },
          error: {
            iconTheme: { primary: '#ff4444', secondary: '#0a0a0a' },
            style: {
              border: '1px solid #ff4444',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
