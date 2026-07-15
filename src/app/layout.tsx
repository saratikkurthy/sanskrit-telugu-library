import type { Metadata } from "next";
import './globals.css';
import { db } from "@/db"; 
import Sidebar from "@/components/Sidebar"; 
import { categories } from "@/db/schema"; 
import { createCategory } from "@/app/actions"; 

export const metadata: Metadata = {
  title: "Sanskrit Telugu Library",
  description: "A library for Sanskrit and Telugu documents",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch data
  const allCategories = await db.select().from(categories);

  return (
    <html lang="en">
      <body style={{ 
        backgroundImage: "url('/krishna.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FDF5E6',
        minHeight: '100vh',
        margin: 0
      }}>
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(253, 245, 230, 0.8)', 
          minHeight: '100vh',
          width: '100%'
        }}>
          {/* Sidebar */}
          <Sidebar categories={allCategories} onAddCategory={createCategory} />

          {/* Main content area */}
          <main style={{ flex: 1, padding: '2rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}