import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// ✅ Load Puter AI Script
const loadPuterScript = () => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.puter) {
            console.log('✅ Puter already loaded');
            resolve(window.puter);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.async = true;
        script.onload = () => {
            console.log('✅ Puter script loaded');
            // Wait for AI to initialize
            const checkInterval = setInterval(() => {
                if (window.puter && window.puter.ai) {
                    console.log('✅ Puter AI ready');
                    clearInterval(checkInterval);
                    resolve(window.puter);
                }
            }, 500);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!window.puter?.ai) {
                    console.warn('⚠️ Puter AI not ready after 10 seconds');
                    reject(new Error('Puter AI timeout'));
                }
            }, 10000);
        };
        script.onerror = () => {
            console.error('❌ Failed to load Puter script');
            reject(new Error('Failed to load Puter script'));
        };
        document.head.appendChild(script);
    });
};

// Load Puter before rendering app
loadPuterScript().catch(err => {
    console.error('Puter load error:', err.message);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);