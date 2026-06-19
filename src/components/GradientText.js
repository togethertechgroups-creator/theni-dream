import React from 'react';
import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ["#ffffff", "#facc15", "#ffffff", "#facc15", "#ffffff"],
  animationSpeed = 8,
  showBorder = false,
  ...rest
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span className={`gradient-text-container ${className}`} {...rest}>
      {showBorder ? (
        <span className="gradient-text-border-wrap" style={gradientStyle}>
          <span className="gradient-text-border-content" style={gradientStyle}>
            {children}
          </span>
        </span>
      ) : (
        <span className="gradient-text-content" style={gradientStyle}>
          {children}
        </span>
      )}
    </span>
  );
}
