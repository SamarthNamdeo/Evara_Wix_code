import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/checklist', label: 'Checklist' },
    { path: '/guests', label: 'Guests' },
    { path: '/vendors', label: 'Vendors' },
    { path: '/calendar', label: 'Calendar' },
    { path: '/ai-assistant', label: 'AI Assistant' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-footerbackground sticky top-0 z-50">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="font-heading text-3xl md:text-4xl text-primary-foreground tracking-wide">
              EVARA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-foreground border-b-2 border-primary-foreground pb-1'
                    : 'text-primary-foreground/80 hover:text-primary-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-6 pb-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-base transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-primary-foreground border-l-2 border-primary-foreground pl-4'
                    : 'text-primary-foreground/80 hover:text-primary-foreground pl-4'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
