'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Compass, LayoutDashboard, LogOut, User, Menu, X, Sparkles, Search } from 'lucide-react';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

  const navLinks = [
    { href: '/', label: 'Opportunities' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/ai-match', label: 'AI Match', highlight: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/70 soft-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary-container rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)]">
              <Compass className="w-4.5 h-4.5 text-on-primary" />
            </div>
            <span className="text-primary font-semibold text-lg hidden sm:block">Navigator AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === link.href
                    ? 'bg-surface-container text-primary'
                    : link.highlight
                    ? 'text-on-tertiary-fixed-variant hover:bg-on-tertiary-fixed-variant/10 hover:text-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden xl:flex items-center bg-surface-container rounded-full px-4 py-2 border border-outline-variant/70 min-w-[280px]">
            <Search className="w-4 h-4 text-outline mr-2" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="w-full bg-transparent border-none outline-none text-sm text-primary placeholder:text-outline"
            />
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-surface-container rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 border border-outline-variant/70">
                  <div className="w-6 h-6 bg-on-tertiary-fixed-variant rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-on-tertiary" />
                  </div>
                  <span className="text-on-surface-variant text-sm truncate max-w-[140px]">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/auth">
                <button className="bg-primary hover:bg-on-surface text-on-primary rounded-full h-9 px-4 font-semibold text-sm shadow-[0_10px_30px_-12px_rgba(0,31,63,0.18)] transition-all">
                  Get Started
                </button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-on-surface-variant hover:text-primary p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-outline-variant space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-surface-container text-primary'
                    : link.highlight
                    ? 'text-on-tertiary-fixed-variant'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.highlight && <Sparkles className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:text-primary w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)}>
                <div className="px-4 py-3 text-on-tertiary-fixed-variant font-semibold text-sm">
                  Sign In / Sign Up
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
