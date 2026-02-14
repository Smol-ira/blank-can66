import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent browser extensions (e.g. MetaMask) from crashing the app with unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason?.message || event.reason || '');
  if (reason.includes('MetaMask') || reason.includes('ethereum')) {
    console.warn('Suppressed external extension error:', reason);
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
