import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MealProvider } from './context/MealContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MealProvider>
      <App />
    </MealProvider>
  </React.StrictMode>
); 