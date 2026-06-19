'use client';

import { useState } from 'react';

export default function VideoBanner() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="video-banner-container">
      {/* Fallback & Overlay Gradients */}
      <div className={`video-fallback-bg ${videoLoaded ? 'fade-out' : ''}`} />
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onPlay={() => setVideoLoaded(true)}
        className={`banner-video ${videoLoaded ? 'loaded' : ''}`}
      >
        {/* Cinematic stock footage of a couple photoshoot */}
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-outside-43229-large.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay for readability */}
      <div className="banner-overlay" />

      
    </div>
  );
}
