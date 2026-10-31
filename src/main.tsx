import React from 'react';
import {createRoot} from 'react-dom/client';
import LegacyApp from './App';
import BridgeApp from './BridgeApp';
import './styles.css';
const App=new URLSearchParams(location.search).get('profile')==='awalol'?LegacyApp:BridgeApp;
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
