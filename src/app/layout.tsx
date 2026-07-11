import type { Metadata } from "next";
import './globals.css';
import { db } from "@/db"; // Adjust path to your db file
import Sidebar from "@/components/Sidebar"; // Ensure this import is here!
import { categories } from "@/db/schema"; // Adjust path to your schema

export const metadata: Metadata = {
  title: "Sanskrit Telugu Library",
  description: "A library for Sanskrit and Telugu documents",
};
// Fetch categories directly from the database
  const allCategories = await db.select().from(categories);

  // Define your add handler (or import it from an action)
  const handleAddCategory = async () => {
    "use server";
    // Logic to add category
  };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundImage: "url('public/krishna.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FDF5E6',
        minHeight: '100vh',
        margin: 0
      }}>
        {/* Main Flex Container */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(253, 245, 230, 0.8)', 
          minHeight: '100vh',
          width: '100%'
        }}>
          {/* Sidebar stays on the left */}
          <Sidebar categories={allCategories} onAddCategory={handleAddCategory} />

          {/* Main content area */}
          <main style={{ flex: 1, padding: '2rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}