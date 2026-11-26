import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import App from './App';

setupIonicReact();
registerSW({ immediate: true });
createRoot(document.getElementById('root')!).render(<App />);
