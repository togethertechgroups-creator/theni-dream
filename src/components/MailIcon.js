'use client';

import React from 'react';

export default function MailIcon({ size = 20, className = '', style = {}, ...props }) {
  return (
    <img 
      src="/mail-icon.png" 
      alt="Mail Icon" 
      width={size} 
      height={size} 
      className={`mail-icon-img ${className}`}
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
