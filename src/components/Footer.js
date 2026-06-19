'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import LocationIcon from '@/components/LocationIcon';
import PhoneIcon from '@/components/PhoneIcon';
import MailIcon from '@/components/MailIcon';
import { usePathname } from 'next/navigation';
import { getServiceCategories } from '@/utils/servicesData';

const InstagramIcon = ({ size = 28 }) => (
  <img src="/instagram-icon.png" alt="Instagram" width={size} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

const FacebookIcon = ({ size = 28 }) => (
  <img src="/facebook-icon.png" alt="Facebook" width={size} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

const YoutubeIcon = ({ size = 28 }) => (
  <img src="/youtube-icon.png" alt="YouTube" width={Math.round(size * 1.235)} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);
  const [activePopupId, setActivePopupId] = useState(null);

  useEffect(() => {
    setCategories(getServiceCategories());
  }, []);

  useEffect(() => {
    if (activePopupId === null) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.footer-cat-container')) {
        setActivePopupId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [activePopupId]);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link href="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="Theni Dream Logo" 
              style={{ height: '48px', width: 'auto', borderRadius: '4px', display: 'block' }} 
            />
            <span className="logo-text-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span className="logo-top-text signature-font" style={{
                fontSize: '22px',
                color: 'currentColor',
                opacity: 0.95,
                lineHeight: '0.7',
                fontFamily: "'Brother Signature', cursive",
                letterSpacing: 'normal',
                textTransform: 'none',
                paddingLeft: '2px',
                marginBottom: '-2px'
              }}>
                Theni
              </span>
              <span className="logo-text" style={{ lineHeight: '1.1', display: 'block' }}>
                Dream <span className="logo-highlight">Photography</span>
              </span>
            </span>
          </Link>
          <p className="footer-desc">
            We capture details, emotions, and candid gestures to turn your milestones into timeless visual legacies. Based in Theni, operating worldwide.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/theni_dream_photography/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <InstagramIcon size={28} />
            </a>
            <a href="https://www.facebook.com/share/1D1nAfnYvL/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <FacebookIcon size={28} />
            </a>
            <a href="https://www.youtube.com/@thenidreamphotography" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Youtube">
              <YoutubeIcon size={28} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Explore</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/portfolio">Portfolio</Link></li>
            <li><Link href="/packages">Packages</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div className="footer-col">
          <h4 className="footer-title">Services</h4>
          <ul className="footer-links">
            {categories.map((cat) => (
              <li key={cat.id} className="footer-cat-container" style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopupId(activePopupId === cat.id ? null : cat.id);
                  }}
                  className="footer-category-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{
                    fontSize: '9px',
                    opacity: 0.6,
                    transform: activePopupId === cat.id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                    display: 'inline-block'
                  }}>▼</span>
                </button>

                {activePopupId === cat.id && (
                  <div
                    className="footer-dropdown-popup glass-card"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '0',
                      marginBottom: '10px',
                      background: 'rgba(255, 243, 227, 0.98)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(249, 115, 22, 0.15)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
                      zIndex: 1000,
                      width: '250px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: 'var(--primary)',
                      letterSpacing: '1px',
                      borderBottom: '1px solid rgba(249, 115, 22, 0.15)',
                      paddingBottom: '6px',
                      marginBottom: '6px'
                    }}>
                      {cat.name} Services
                    </div>
                    {cat.services && cat.services.map((svc) => (
                      <Link
                        key={svc.id}
                        href={`/services?cat=${cat.id}`}
                        onClick={() => setActivePopupId(null)}
                        style={{
                          fontSize: '13.5px',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s',
                          display: 'block',
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(249, 115, 22, 0.08)';
                          e.target.style.color = 'var(--primary)';
                          e.target.style.paddingLeft = '12px';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#4b5563';
                          e.target.style.paddingLeft = '8px';
                        }}
                      >
                        {svc.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div className="footer-col contact-col">
          <h4 className="footer-title">Get In Touch</h4>
          <ul className="contact-details">
            <li>
              <LocationIcon className="contact-icon" size={26} />
              <a 
                href="https://maps.app.goo.gl/ZMtpWSx9xYX7737U9" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                J.P. Ganesan, Krishnan Kovil Near, Main Bazaar Street, Bomayakoundanpatti, Theni - 625531, Tamil Nadu.
              </a>
            </li>
            <li>
              <PhoneIcon className="contact-icon" size={26} />
              <a href="tel:+919854002628">+91 98540 02628</a>
            </li>
            <li>
              <MailIcon className="contact-icon" size={26} />
              <a href="mailto:thenidreamphotography@gmail.com">thenidreamphotography@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright">
            &copy; {currentYear} Theni Dream Photography. All Rights Reserved.
          </p>
          <div className="bottom-right-group">
            <div className="bottom-links">
              <Link href="/contact">Privacy Policy</Link>
              <Link href="/contact">Terms & Conditions</Link>
            </div>
            <p className="powered-by">
              Powered by{' '}
              <a href="https://togethertechgroups.in" target="_blank" rel="noopener noreferrer" className="powered-link">
                Together Tech Groups
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
