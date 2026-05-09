import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import NavbarWrapper from '@/components/NavbarWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken-grotesk',
});

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
      <body className={`${hankenGrotesk.variable} bg-surface text-on-surface antialiased`}>
        <AuthProvider>
          <NavbarWrapper />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
