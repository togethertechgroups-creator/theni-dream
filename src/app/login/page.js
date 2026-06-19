'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Key, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Check, 
  HelpCircle,
  Home
} from 'lucide-react';
import { mockStore } from '@/utils/mockStore';

export default function LoginPage() {
  const router = useRouter();
  const [eventCode, setEventCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // States for verification
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!eventCode.trim()) {
      setErrorMsg('Please enter your Event Code.');
      return;
    }

    setIsLoading(true);

    // Simulate verification check
    setTimeout(() => {
      const albums = mockStore.getAlbums();
      const matched = albums.find(
        (a) => a.eventCode && a.eventCode.toLowerCase() === eventCode.trim().toLowerCase()
      );

      if (matched) {
        setIsLoading(false);
        setIsSuccess(true);

        // Redirect after showing checkmark animation
        setTimeout(() => {
          router.push(`/client-gallery/${matched.eventCode}`);
        }, 1200);
      } else {
        setIsLoading(false);
        setErrorMsg('Invalid Event Code. Please contact your studio representative.');
      }
    }, 1500);
  };

  return (
    <div className="admin-login-wrapper">
      {/* Animated background */}
      <div className="login-bg-glow-orange"></div>
      <div className="login-bg-glow-purple"></div>
      <div className="login-floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card-glass">
          {/* Back to Home Button */}
          <div className="back-to-home-wrapper">
            <Link href="/" className="back-to-home-link">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Header */}
          <div className="login-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="login-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span>Dream <span className="logo-highlight">Photography</span></span>
            </div>
            <h2 className="login-title mitshuka-title-font" style={{ color: 'var(--primary)' }}>
              Portal Access
            </h2>
            <p className="login-subtitle">Unlock your premium event experience</p>
          </div>

          {isSuccess ? (
            <div className="auth-success-screen animate-scale-up">
              <div className="success-checkmark-circle">
                <Check size={40} className="success-check-icon" />
              </div>
              <h3 className="success-title">Gallery Unlocked!</h3>
              <p className="success-desc">Opening your private event showcase...</p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="auth-error-box animate-shake">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* CLIENT LOGIN FORM */}
              <form onSubmit={handleClientSubmit} className="login-form-content">
                <div className="login-input-group">
                  <label className="login-label">Event Passcode / Code</label>
                  <div className="login-input-wrapper">
                    <Key size={18} className="login-input-icon" />
                    <input
                      type="text"
                      className="login-input-control"
                      placeholder="e.g. AJITH01"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <span className="otp-code-hint" style={{ marginTop: '4px' }}>
                    Try: <strong>AJITH01</strong> or <strong>KARTHI09</strong>
                  </span>
                </div>

                <div className="login-input-group">
                  <label className="login-label">Mobile Number (Optional)</label>
                  <div className="login-input-wrapper">
                    <HelpCircle size={18} className="login-input-icon" />
                    <input
                      type="tel"
                      className="login-input-control"
                      placeholder="For verification"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-login-submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                      <span>Verifying Passcode...</span>
                    </>
                  ) : (
                    <>
                      <span>View Gallery</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      <style jsx global>{`
        .back-to-home-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .back-to-home-link {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          color: #71717a !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
          padding: 8px 16px !important;
          border-radius: 50px !important;
          background: rgba(0, 0, 0, 0.03) !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
        }

        .back-to-home-link svg {
          margin-right: 2px !important;
        }

        .back-to-home-link:hover {
          color: var(--primary) !important;
          background: rgba(249, 115, 22, 0.08) !important;
          border-color: rgba(249, 115, 22, 0.2) !important;
          transform: translateX(-3px);
        }
      `}</style>
    </div>
  );
}
