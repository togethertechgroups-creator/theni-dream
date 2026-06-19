'use client';

import React from 'react';

export default function LocationIcon({ size = 20, className = '', style = {}, ...props }) {
  return (
    <img 
      src="/location-icon.png" 
      alt="Location Pin Icon" 
      width={size} 
      height={size} 
      className={`location-icon-img ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        ...style
      }}
      {...props}
    />
  );
}
