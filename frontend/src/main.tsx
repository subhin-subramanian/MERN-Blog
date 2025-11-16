import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.js';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root') as HTMLElement;

if(!rootElement){
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>
)
