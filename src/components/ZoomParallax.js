'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

/**
 * ZoomParallax – Only the CENTER image (index 0) zooms on scroll.
 * The surrounding images are static decorative tiles.
 *
 * Layout positions (position:relative offset from flex-center):
 *   index 0 → CENTER   25vw × 25vh  (zooms)
 *   index 1 → top      35vw × 30vh  top:-30vh  left:5vw
 *   index 2 → left     20vw × 45vh  top:-10vh  left:-25vw
 *   index 3 → right    25vw × 25vh  top:0      left:27.5vw
 *   index 4 → bot-right 20vw × 25vh top:27.5vh left:5vw
 *   index 5 → bot-left  30vw × 25vh top:27.5vh left:-22.5vw
 *   index 6 → accent    15vw × 15vh top:22.5vh left:25vw
 */
const IMAGE_LAYOUTS = [
  { width: '25vw', height: '25vh', top: '0', left: '0' },
  { width: '35vw', height: '30vh', top: '-30vh', left: '5vw' },
  { width: '20vw', height: '45vh', top: '-10vh', left: '-25vw' },
  { width: '25vw', height: '25vh', top: '0', left: '27.5vw' },
  { width: '20vw', height: '25vh', top: '27.5vh', left: '5vw' },
  { width: '30vw', height: '25vh', top: '27.5vh', left: '-22.5vw' },
  { width: '15vw', height: '15vh', top: '22.5vh', left: '25vw' },
];

export function ZoomParallax({ images = [] }) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Only center image zooms; all others stay at scale 1
  const centerScale = useTransform(scrollYProgress, [0, 1], [1, 6]);

  return (
    <div ref={container} className="zoom-parallax-wrapper">
      <div className="zoom-parallax-sticky">
        {images.slice(0, 7).map(({ src, alt }, index) => {
          const layout = IMAGE_LAYOUTS[index] ?? IMAGE_LAYOUTS[0];
          const isCenter = index === 0;

          return (
            <motion.div
              key={index}
              style={{ scale: isCenter ? centerScale : 1 }}
              className="zoom-parallax-layer"
            >
              <div
                style={{
                  position: 'relative',
                  width: layout.width,
                  height: layout.height,
                  top: layout.top,
                  left: layout.left,
                  overflow: 'hidden',
                  flexShrink: 0,
                  borderRadius: isCenter ? '4px' : '4px',
                }}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
