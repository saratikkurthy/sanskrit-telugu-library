export default function Loading() {
  return (
    <main style={{ padding: '2rem', backgroundColor: '#fff7ed', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#7c2d12', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading Library...</h1>
      <div style={{ marginTop: '1rem', width: '50px', height: '50px', border: '5px solid #fed7aa', borderTop: '5px solid #7c2d12', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </main>
  );
}