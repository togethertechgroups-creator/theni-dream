'use client';

import { useState, useEffect } from 'react';
import { Camera, Award, ShieldCheck, Heart, Users, CheckCircle, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { mockStore } from '@/utils/mockStore';

export default function AboutPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setTeam(mockStore.getTeam());
    document.title = "About Us | Theni Dream Photography";
  }, []);

  const achievements = [
    {
      title: "Best Wedding Photographer of the Year",
      org: "South Indian Photography Association",
      year: "2024",
      desc: "Recognized for capturing outstanding cinematic moments and composition."
    },
    {
      title: "Top 10 Candid Photographers in Tamil Nadu",
      org: "Royal Photography Guild",
      year: "2023",
      desc: "Ranked among the premier creative wedding documentarians in the region."
    },
    {
      title: "Excellence in Aerial Cinematography",
      org: "National Drone Guild Awards",
      year: "2025",
      desc: "Awarded for exceptional composition in high-altitude outdoor ceremony coverage."
    }
  ];

  return (
    <div className="about-page-wrapper">
      {/* 1. Header Banner */}
      <section className="about-hero section-padding page-hero-bg">
        <div className="container text-center">
          <ScrollReveal animation="fade-down" delay={100}>
            <span className="section-tag">About Us</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="section-title mitshuka-title-font">Our Story & Creative Vision</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={350}>
            <p className="section-subtitle max-w-xl">
              We are a group of visual artists, storytellers, and technical experts dedicated to turning your fleeting milestones into timeless artistic legacies.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Photographer Story / Introduction */}
      <section className="story-section section-padding">
        <div className="container grid-2 align-center">
          <ScrollReveal animation="fade-right" delay={150}>
            <div className="story-content">
              <h2 className="serif-font section-inner-title">
                The Heart Behind The Lens: <span className="gradient-text">J.P. Ganesan's Story</span>
              </h2>
              <p className="story-p">
                Theni Dream Photography was founded by J.P. Ganesan, who began his career with a simple film camera wandering the scenic hills of Theni. His passion for natural light and candid human expressions soon evolved into a premier luxury photography brand.
              </p>
              <p className="story-p">
                "To me, photography is not about cameras and settings; it is about feelings. A great image must make you hear the laughter again, feel the warmth of the touch, and smell the flowers of the wedding stage years later. That is what we call capturing a dream."
              </p>
              <div className="experience-badge-row">
                <div className="exp-item">
                  <span className="exp-num">6+</span>
                  <span className="exp-lbl">Years Experience</span>
                </div>
                <div className="exp-item">
                  <span className="exp-num">200+</span>
                  <span className="exp-lbl">Events Completed</span>
                </div>
                <div className="exp-item">
                  <span className="exp-num">100%</span>
                  <span className="exp-lbl">Happy Families</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={200}>
            <div className="story-visual etech-curve shadow-lg">
              <img
                src="/pic/pic-5.png"
                alt="Photographer J.P. Ganesan in Action"
                className="about-story-img"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2.5 Quote Banner Section */}
      <section className="about-quote-section">
        <div className="quote-decor-circle quote-decor-circle-1"></div>
        <div className="quote-decor-circle quote-decor-circle-2"></div>
        <div className="container">
          <ScrollReveal animation="zoom-in" delay={150}>
            <div className="about-quote-container">
              <div className="quote-icon-wrapper">
                <Quote size={60} strokeWidth={1} />
              </div>
              <p className="quote-text-content">
                "Life is like a camera.<br />
                Focus on what's important.<br />
                Capture the good times.<br />
                And if things don't work out,<br />
                just take another shot."
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Achievements Section */}
      <section className="achievements-section section-padding gradient-bg">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <span className="section-tag">Milestones</span>
              <h2 className="section-title mitshuka-title-font">Our Achievements & Recognitions</h2>
              <p className="section-subtitle">
                Our pursuit of creative excellence and print craftsmanship has earned us accolades across national and state photography circles.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid-3">
            {achievements.map((ach, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 150}>
                <div className="achievement-card glass-card etech-curve">
                  <div className="ach-icon-box">
                    <Award size={32} className="ach-icon" />
                    <span className="ach-year">{ach.year}</span>
                  </div>
                  <h3 className="ach-title">{ach.title}</h3>
                  <h4 className="ach-org">{ach.org}</h4>
                  <p className="ach-desc">{ach.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Details / Values */}
      <section className="values-section section-padding">
        <div className="container">
          <div className="grid-2 align-center">
            <ScrollReveal animation="fade-right" delay={150}>
              <div className="values-visual">
                <div className="image-grid-2x2">
                  <img src="/pic/hema-bride.jpeg" alt="Wedding detail" className="grid-img-1 etech-curve" />
                  <img src="/pic/santhosh-ananthi.jpeg" alt="Couple smile" className="grid-img-2 etech-curve" />
                </div>
              </div>
            </ScrollReveal>

            <div className="values-content">
              <ScrollReveal animation="fade-left" delay={100}>
                <span className="section-tag">Our Philosophy</span>
                <h2 className="section-title neogen-black-font">
                  A Premium Experience <br />
                  <span className="gradient-text mitshuka-font">from Start to Finish</span>
                </h2>
                <p className="values-desc">
                  We believe that premium photography requires planning and detail. We work closely with our clients at every step to ensure your wedding is captured exactly as you dreamed it.
                </p>
              </ScrollReveal>

              <div className="value-points">
                {[
                  {
                    title: "Pre-Shoot Planning",
                    desc: "Consultations to discuss outfits, timeline flow, and background palettes."
                  },
                  {
                    title: "Advanced In-House Editing",
                    desc: "Every photo is color-graded and retouched to cinematic standards manually."
                  },
                  {
                    title: "Custom Premium Albums",
                    desc: "Handcrafted matte/glass acrylic albums imported from specialized print houses."
                  }
                ].map((val, idx) => (
                  <ScrollReveal key={idx} animation="fade-left" delay={200 + idx * 100}>
                    <div className="value-point">
                      <CheckCircle className="value-point-icon" size={20} />
                      <div>
                        <strong>{val.title}</strong>
                        <p>{val.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Members */}
      <section className="team-section section-padding gradient-bg">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header">
              <span className="section-tag">Creative Minds</span>
              <h2 className="section-title serif-font">Meet Our Team</h2>
              <p className="section-subtitle">
                A dedicated crew of photographers, cinematographers, drone operators, and editors working together to create visual masterpieces.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid-4">
            {team.map((member, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 120}>
                <div className="team-card glass-card etech-curve">
                  <div className="team-img-box">
                    <img src={member.image} alt={member.name} className="team-img" />
                  </div>
                  <div className="team-body">
                    <h3 className="team-name">{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                    <p className="team-bio">{member.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
