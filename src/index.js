// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component
import './index.css'; // Import the global CSS
import reportWebVitals from './reportWebVitals';

// Create the root DOM node and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Measure app performance
reportWebVitals();

