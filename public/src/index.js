import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3ModalProvider } from './components/wallet/Web3Modal';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3ModalProvider>
      <App />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }
        }} 
      />
    </Web3ModalProvider>
  </React.StrictMode>
);