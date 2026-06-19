'use client';

import { useState, useEffect } from 'react';
import { Clock, Send, Check } from 'lucide-react';
import LocationIcon from '@/components/LocationIcon';
import PhoneIcon from '@/components/PhoneIcon';
import MailIcon from '@/components/MailIcon';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import ScrollReveal from '@/components/ScrollReveal';
import { getServiceCategories, getFlattenedServices } from '@/utils/servicesData';

const InstagramIcon = ({ size = 24 }) => (
  <img src="/instagram-icon.png" alt="Instagram" width={size} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

const FacebookIcon = ({ size = 24 }) => (
  <img src="/facebook-icon.png" alt="Facebook" width={size} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

const YoutubeIcon = ({ size = 24 }) => (
  <img src="/youtube-icon.png" alt="YouTube" width={Math.round(size * 1.235)} height={size} style={{ display: 'block', objectFit: 'contain' }} />
);

export default function ContactPage() {
  const [msgName, setMsgName] = useState('');
  const [msgEvent, setMsgEvent] = useState('');
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);

  useEffect(() => {
    setServicesList(getFlattenedServices(getServiceCategories()));
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMsgSent(true);
      setTimeout(() => {
        setMsgName('');
        setMsgEvent('');
        setMsgText('');
        setMsgSent(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Header Banner */}
      <section className="contact-hero section-padding page-hero-bg">
        <div className="container text-center">
          <ScrollReveal animation="fade-down" delay={100}>
            <span className="section-tag">Contact</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="section-title mitshuka-title-font">Get In Touch</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={350}>
            <p className="section-subtitle max-w-xl">
              Whether you want to book a date or have questions about packages, drop us a line. We are here to talk.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Contact details and Map grids */}
      <section className="contact-details-section section-padding">
        <div className="container grid-2">
          {/* Details column */}
          <div className="contact-info-col">
            <ScrollReveal animation="fade-right" delay={100}>
              <span className="section-tag">Connect</span>
              <h2 className="serif-font info-title font-bold">Location & Contact Details</h2>
              <p className="info-desc">
                Visit our boutique studio in Theni or reach out via phone, email, or social networks.
              </p>
            </ScrollReveal>

            <ul className="contact-list-box">
              <ScrollReveal animation="fade-right" delay={200}>
                <li className="contact-list-item glass-card etech-curve">
                  <LocationIcon className="contact-icon bg-purple-tint" size={32} />
                  <div className="item-text">
                    <strong>Studio Address</strong>
                    <p>
                      <a 
                        href="https://maps.app.goo.gl/ZMtpWSx9xYX7737U9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        J.P. Ganesan,<br />
                        Krishnan Kovil Near,<br />
                        Main Bazaar Street, Bomayakoundanpatti,<br />
                        Theni - 625531, Tamil Nadu.
                      </a>
                    </p>
                  </div>
                </li>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={300}>
                <li className="contact-list-item glass-card etech-curve">
                  <PhoneIcon className="contact-icon bg-pink-tint" size={32} />
                  <div className="item-text">
                    <strong>Phone Numbers</strong>
                    <p>
                      <a href="tel:+919854002628">+91 98540 02628</a> (Founder)<br />
                      <a href="tel:+919854002628">+91 98540 02628</a> (Studio)
                    </p>
                  </div>
                </li>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={350}>
                <li className="contact-list-item glass-card etech-curve">
                  <WhatsAppIcon className="contact-icon bg-green-tint" style={{ color: '#25d366' }} size={32} />
                  <div className="item-text">
                    <strong>WhatsApp Chat</strong>
                    <p>
                      <a href="https://wa.me/919854002628" target="_blank" rel="noopener noreferrer">
                        +91 98540 02628
                      </a> (Direct Chat)
                    </p>
                  </div>
                </li>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={400}>
                <li className="contact-list-item glass-card etech-curve">
                  <MailIcon className="contact-icon bg-gold-tint" size={32} />
                  <div className="item-text">
                    <strong>Email Queries</strong>
                    <p>
                      <a href="mailto:thenidreamphotography@gmail.com">thenidreamphotography@gmail.com</a><br />
                      <a href="tel:+919854002628">+91 98540 02628</a>
                    </p>
                  </div>
                </li>
              </ScrollReveal>
            </ul>

            {/* Social Grid */}
            <ScrollReveal animation="fade-right" delay={500}>
              <div className="studio-social-box glass-card etech-curve">
                <strong>Follow Our Daily Shoots</strong>
                <div className="social-icon-row">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-anchor btn-instagram" aria-label="Instagram">
                    <InstagramIcon size={24} />
                    <span>Instagram</span>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-anchor btn-facebook" aria-label="Facebook">
                    <FacebookIcon size={24} />
                    <span>Facebook</span>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-anchor btn-youtube" aria-label="Youtube">
                    <YoutubeIcon size={24} />
                    <span>Youtube</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Quick Message Box */}
          <ScrollReveal animation="fade-left" delay={250}>
            <div className="contact-form-col glass-card etech-curve">
              <h3 className="serif-font card-form-title">Send a Quick Message</h3>
              <p className="card-form-desc">Have a quick question? Message us directly right here.</p>

              <form onSubmit={handleSendMessage} className="quick-message-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg-name">Your Name</label>
                  <input
                    type="text"
                    id="contact-msg-name"
                    className="form-control"
                    placeholder="Sanjay Kumar"
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    required
                    disabled={loading || msgSent}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg-event">Select Event</label>
                  <select
                    id="contact-msg-event"
                    className="form-control"
                    style={{
                      appearance: 'none',
                      background: 'rgba(255,255,255,0.02) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23f97316\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E") no-repeat right 16px center',
                      backgroundSize: '16px',
                      paddingRight: '40px',
                      cursor: 'pointer'
                    }}
                    value={msgEvent}
                    onChange={(e) => setMsgEvent(e.target.value)}
                    required
                    disabled={loading || msgSent}
                  >
                    <option value="" disabled style={{ color: 'var(--fg-muted)' }}>-- Choose an Event --</option>
                    {servicesList.map((service) => (
                      <option key={service.id} value={service.name} style={{ color: 'var(--fg-main)', background: 'var(--bg-card)' }}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-msg-text">Your Message</label>
                  <textarea
                    id="contact-msg-text"
                    rows="3"
                    className="form-control text-area"
                    placeholder="Ask us anything about bookings, dates, custom quotes..."
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    required
                    disabled={loading || msgSent}
                  />
                </div>

                <button
                  type="submit"
                  id="btn-send-contact-msg"
                  className="btn btn-primary quick-submit-btn"
                  disabled={loading || msgSent}
                >
                  {msgSent ? <Check size={16} /> : <Send size={16} />}
                  {loading ? 'Sending Message...' : msgSent ? 'Message Sent!' : 'Send Message'}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Google Map section */}
      <section className="google-map-section section-padding gradient-bg">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <span className="section-tag">Locate Us</span>
              <h2 className="section-title serif-font">Our Location on Map</h2>
              <p className="section-subtitle">We are conveniently located at Bomayakoundanpatti in Theni. Come visit us for custom album samples.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <div className="map-container glass-card etech-curve">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5843477122177!2d77.4784405!3d9.968478499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b071507354f0be3%3A0x5d71979090245cd!2sTheni+DREAM+Photography!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Theni Dream Photography location map"
                id="google-maps-embed-iframe"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
