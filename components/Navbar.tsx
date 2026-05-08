'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Compass, LayoutDashboard, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-400 transition-colors shadow-md shadow-teal-500/20">
              <Compass className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">OpportunityAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === link.href
                    ? 'bg-slate-800 text-white'
                    : link.highlight
                    ? 'text-teal-400 hover:bg-teal-500/10 hover:text-teal-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.highlight && <Sparkles className="w-3.5 h-3.5" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-8 bg-slate-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-1.5">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-slate-300 text-sm truncate max-w-[140px]">{user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-teal-500 hover:bg-teal-400 text-white rounded-lg h-9 px-4 font-semibold text-sm shadow-md shadow-teal-500/20">
                  Get Started
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-slate-800 text-white'
                    : link.highlight
                    ? 'text-teal-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.highlight && <Sparkles className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)}>
                <div className="px-4 py-3 text-teal-400 font-medium text-sm">
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
