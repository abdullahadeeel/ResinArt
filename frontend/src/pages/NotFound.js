import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ textAlign: 'center' }}>
        <FiAlertCircle size={80} color="#f59e0b" style={{ marginBottom: '24px' }} />
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#1f2937' }}>404</h1>
        <h2 style={{ fontSize: '24px', color: '#4b5563', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiHome /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;