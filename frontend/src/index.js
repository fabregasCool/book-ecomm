import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StoreProvider } from './Store'; //Enregistre notre valeur afin qu'on puisse les réutiliser partout dans nos composants

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          {/* deferLoading={true} /car on ne veut pas charger paypal au debut du chargement de l'application */}
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
