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

  // Animate the image change crossfade
  useEffect(() => {
    setFade(true);
    const timer = setTimeout(() => {
      setImgSrc(MONTH_IMAGES[month]);
      setFade(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [month]);

  return (
    <div className="relative w-full h-64 sm:h-auto sm:min-h-full sm:flex-grow overflow-hidden flex flex-col">
      {/* Spiral Binding Overlay for the Image Component Portion */}
      <div className="absolute top-0 left-0 right-0 z-20 spiral-binding"></div>
      
      {/* Main Image */}
      <img
        src={imgSrc}
        alt={`${monthName} calendar hero artwork`}
        className={`object-cover w-full h-full absolute inset-0 hero-image-transition ${fade ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

      {/* Decorative Text Banner */}
      <div 
        className="absolute bottom-4 right-0 z-10 bg-blue-600 text-white pl-6 pr-4 py-2 shadow-2xl flex flex-col items-end transform translate-x-1" 
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-90 drop-shadow-sm">{year}</span>
        <span className="text-2xl lg:text-3xl font-black uppercase tracking-widest drop-shadow-md">{monthName}</span>
      </div>
    </div>
  );
}
