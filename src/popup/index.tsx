import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { Popup } from './Popup';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
