export default function AuthLayout({ children }) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{
          padding: '30px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </div>
    );
  }
  