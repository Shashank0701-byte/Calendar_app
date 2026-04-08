import React, { useState, useEffect } from 'react';
import { MONTH_IMAGES } from './calendarData';

interface HeroImageProps {
  currentDate: Date;
}

export function HeroImage({ currentDate }: HeroImageProps) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const [imgSrc, setImgSrc] = useState(MONTH_IMAGES[month]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => {
      setImgSrc(MONTH_IMAGES[month]);
      setFade(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [month]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-200" style={{ aspectRatio: '16 / 9' }}>
      {/* Main Image */}
      <img
        src={imgSrc}
        alt={`${monthName} calendar hero artwork`}
        className={`object-cover w-full h-full absolute inset-0 hero-image-transition ${fade ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      />
      
      {/* Gradient overlay at bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

      {/* Diagonal blue banner — matches the physical calendar reference */}
      <svg className="absolute bottom-0 right-0 w-[320px] h-[120px] sm:w-[400px] sm:h-[140px]" viewBox="0 0 400 140" preserveAspectRatio="none">
        <polygon points="100,0 400,0 400,140 0,140" fill="#2563eb" />
      </svg>
      
      {/* Month + Year text on the banner */}
      <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 z-10 text-right">
        <div className="text-white/80 text-sm sm:text-base font-bold tracking-[0.3em]">{year}</div>
        <div className="text-white text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-widest leading-none">{monthName}</div>
      </div>
    </div>
  );
}
