'use client';

import React from 'react';

export default function PhoneIcon({ size = 20, className = '', style = {}, ...props }) {
  return (
    <img 
      src="/phone-icon.png" 
      alt="Phone Icon" 
      width={size} 
      height={size} 
      className={`phone-icon-img ${className}`}
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
