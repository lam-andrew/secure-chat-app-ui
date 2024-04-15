import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './context/UserContext';

const OauthClientID = process.env.REACT_APP_OAUTH_CLIENT_ID;

if (!OauthClientID) {
  throw new Error("REACT_APP_OAUTH_CLIENT_ID environment variable is not set.");
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GoogleOAuthProvider clientId={OauthClientID}>
    <UserProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserProvider>
  </GoogleOAuthProvider>
);

reportWebVitals();
