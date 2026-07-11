"use client";
import { useState } from 'react';
import { triggerScan } from '@/app/actions/scan';

export default function ScanButton() {
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    const result = await triggerScan();
    alert(result.message);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleScan} 
      disabled={loading}
      style={{ padding: '0.5rem 1rem', backgroundColor: loading ? '#ccc' : '#0070f3', color: 'white', borderRadius: '4px' }}
    >
      {loading ? "Scanning PDFs..." : "Scan New PDFs"}
    </button>
  );
}