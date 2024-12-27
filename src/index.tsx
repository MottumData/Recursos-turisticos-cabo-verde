import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // Asegúrate de que el contenedor no sea null
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);