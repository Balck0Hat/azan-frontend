import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminApp from './admin/AdminApp';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';
import "./i18n"; // مهم: نحمل i18n قبل أي شيء

const isAdmin = window.location.pathname.startsWith('/admin');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    isAdmin ? (
        <AdminApp />
    ) : (
        <ThemeProvider>
            <App />
        </ThemeProvider>
    )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register Service Worker for PWA and notifications
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered:', registration);
            })
            .catch((error) => {
                console.log('SW registration failed:', error);
            });
    });

    // لما SW جديد يتحكم بالصفحة — reload مرة وحدة لتحميل الملفات الجديدة
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}
