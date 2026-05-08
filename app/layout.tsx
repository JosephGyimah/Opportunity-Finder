import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import NavbarWrapper from '@/components/NavbarWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Opportunity Finder',
  description: 'Find opportunities that match your skills and interests',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <AuthProvider>
          <NavbarWrapper />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
