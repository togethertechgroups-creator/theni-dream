'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showMobileLogin, setShowMobileLogin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('body-scroll-lock');
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.classList.remove('body-scroll-lock');
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.classList.remove('body-scroll-lock');
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showLoginDropdown) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.login-dropdown-wrapper')) {
        setShowLoginDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showLoginDropdown]);

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login'))) {
    return null;
  }

  const isHomePage = pathname === '/';
  // Hide the floating logo on the Home page when unscrolled (in the hero section)
  const isLogoVisible = !isHomePage || scrolled;
  const logoVisibilityClass = isLogoVisible ? '' : 'logo-hidden';

  const leftLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Packages', href: '/packages' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`navbar-header ${scrolled ? 'scrolled' : ''} ${isHomePage ? 'is-home' : 'not-home'} ${!isHomePage ? 'mobile-hidden-nav' : ''}`}>
        <div className="container nav-container">

          {/* Mobile-only logo inside capsule */}
          <Link href="/" className="logo-link mobile-only-logo" aria-label="Theni Dream Home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/hero-logo.png"
              alt="Theni Dream Logo"
              style={{ height: '36px', width: 'auto', display: 'block' }}
            />
            <span className="logo-text-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span className="logo-top-text signature-font" style={{
                fontSize: '18px',
                color: 'currentColor',
                opacity: 0.95,
                lineHeight: '0.7',
                fontFamily: "'Brother Signature', cursive",
                letterSpacing: 'normal',
                textTransform: 'none',
                paddingLeft: '2px',
                marginBottom: '-1px'
              }}>
                Theni
              </span>
              <span className="logo-text mitshuka-font" style={{ lineHeight: '1.1', display: 'block' }}>
                Dream <span className="logo-highlight">Photography</span>
              </span>
            </span>
          </Link>

          {/* Left Navigation (Main Menu - Desktop only) */}
          <nav className="desktop-nav left-nav">
            {leftLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>



          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Floating Side Menu Button (Mobile Only, Non-Home Pages Only) */}
      {!isHomePage && !isOpen && (
        <button
          className="floating-side-menu-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Separate Logo on the far left desktop */}
      <div className={`desktop-only-logo-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo-link" aria-label="Theni Dream Home" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/hero-logo.png"
            alt="Theni Dream Logo"
            style={{ width: 'auto', display: 'block' }}
          />
        </Link>
      </div>

      {/* Separate Login button on the far right desktop */}
      <div className={`desktop-only-login-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="login-dropdown-wrapper">
          <button
            onClick={() => setShowLoginDropdown(!showLoginDropdown)}
            className={`btn-nav-login ${pathname === '/login' || pathname === '/admin' ? 'active' : ''}`}
            aria-label="Login"
            title="Login"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>

          {showLoginDropdown && (
            <div className="login-dropdown-menu">
              <Link
                href="/login"
                className="dropdown-item"
                onClick={() => setShowLoginDropdown(false)}
              >
                Client Login
              </Link>
              <Link
                href="/admin"
                className="dropdown-item"
                onClick={() => setShowLoginDropdown(false)}
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`mobile-nav-overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`} data-lenis-prevent>
        <div className="drawer-header">
          <span className="drawer-title">Menu</span>
          <button className="mobile-menu-btn" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="mobile-nav-links">
          {leftLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="mobile-login-accordion" style={{ width: '100%' }}>
            <button
              onClick={() => setShowMobileLogin(!showMobileLogin)}
              className={`mobile-nav-link ${pathname === '/admin' || pathname === '/login' ? 'active' : ''}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
            >
              <span>Login</span>
              <span style={{ fontSize: '10px', transform: showMobileLogin ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {showMobileLogin && (
              <div className="mobile-sub-menu" style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px', marginBottom: '10px' }}>
                <Link
                  href="/login"
                  className="mobile-nav-link"
                  style={{ fontSize: '15px', padding: '8px 0', borderBottom: 'none' }}
                  onClick={() => {
                    setShowMobileLogin(false);
                    setIsOpen(false);
                  }}
                >
                  Client Login
                </Link>
                <Link
                  href="/admin"
                  className="mobile-nav-link"
                  style={{ fontSize: '15px', padding: '8px 0', borderBottom: 'none' }}
                  onClick={() => {
                    setShowMobileLogin(false);
                    setIsOpen(false);
                  }}
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="btn btn-primary mobile-nav-cta"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      </div>

      <style jsx global>{`
        /* Desktop link columns display rules */
        @media (max-width: 1200px) {
          .desktop-nav {
            display: none !important;
          }
        }

        .login-dropdown-wrapper {
          position: relative;
        }

        .login-dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 12px;
          min-width: 150px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 0 15px rgba(249, 115, 22, 0.05);
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 1000;
          animation: slideDownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: block;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          text-align: left;
        }

        .dropdown-item:hover {
          background: rgba(249, 115, 22, 0.08);
          color: var(--primary);
        }

        /* Mobile specific hidden nav and floating menu button */
        @media (max-width: 768px) {
          .mobile-hidden-nav {
            display: none !important;
          }

          .floating-side-menu-btn {
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 1000;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(249, 115, 22, 0.25);
            box-shadow: 0 8px 32px rgba(249, 115, 22, 0.15);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 0;
          }

          .floating-side-menu-btn:hover,
          .floating-side-menu-btn:active {
            transform: scale(1.05);
            background: #ffffff;
            border-color: var(--primary);
            box-shadow: 0 10px 35px rgba(249, 115, 22, 0.25);
          }
        }

        @media (min-width: 769px) {
          .floating-side-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
