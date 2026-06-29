import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiLock } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ textAlign: 'center' }}>
        <FiLock size={80} color="#ef4444" style={{ marginBottom: '24px' }} />
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937' }}>403</h1>
        <h2 style={{ fontSize: '24px', color: '#4b5563', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          You don't have permission to access this page.
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

export default Unauthorized;