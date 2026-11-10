import React from 'react';

export default function RankersPathLogo({ className = "h-11 sm:h-13 w-auto" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 540 76"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="rpRoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0B1B3D" />
        </linearGradient>
      </defs>

      {/* 1. LEFT EMBLEM BOX (R ON ROAD) */}
      <g transform="translate(4, 3)">
        {/* Soft Cream Box */}
        <rect x="0" y="0" width="70" height="70" rx="8" fill="#FFFDF2" stroke="#E2E8F0" strokeWidth="1.5" />
        
        {/* Stylized Slanted Capital R */}
        <path
          d="M 14 62 L 23 14 L 46 14 C 56 14 62 20 60 29 C 58.5 35.5 53 39 44 40.5 L 56 62 L 44 62 L 34.5 42 L 27.5 42 L 24.2 62 Z"
          fill="#009FE3"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Inner Bowl Hole */}
        <path
          d="M 30.5 22 L 43 22 C 47.5 22 50.5 24.5 49.5 28.5 C 48.5 32 44.5 33.5 40 33.5 L 28.5 33.5 Z"
          fill="#FFFFFF"
        />
        
        {/* Highway Road Perspective Streaks */}
        <polygon points="26,62 38,44 42,44 32,62" fill="url(#rpRoadGrad)" />
        <polygon points="34,62 44,48 46.5,48 37.5,62" fill="#38BDF8" />
        <polygon points="41,62 49,52 51,52 44,62" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Subtle Vertical Divider */}
      <line x1="79" y1="5" x2="79" y2="71" stroke="#E11D23" strokeWidth="1.2" strokeOpacity="0.35" />

      {/* 2. COACHING NAME: RankersPath (No space between Rankers and Path) */}
      <g transform="translate(86, 46)">
        {/* Cyan Outline */}
        <text
          x="0"
          y="0"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontSize="44"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="0.5"
          fill="#009FE3"
          stroke="#009FE3"
          strokeWidth="5"
          strokeLinejoin="round"
        >RankersPath</text>

        {/* White Inner Border */}
        <text
          x="0"
          y="0"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontSize="44"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="0.5"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinejoin="round"
        >RankersPath</text>

        {/* Vibrant Red Fill */}
        <text
          x="0"
          y="0"
          fontFamily="'Arial Black', 'Impact', sans-serif"
          fontSize="44"
          fontWeight="900"
          fontStyle="italic"
          letterSpacing="0.5"
          fill="#E11D23"
        >RankersPath</text>
      </g>

      {/* 3. TAGLINE (NICHE KI LINE): Safalta Ka Sankalp */}
      <text
        x="245"
        y="67"
        fontFamily="'Brush Script MT', 'Dancing Script', 'Caveat', 'Segoe Script', cursive, sans-serif"
        fontSize="21"
        fontStyle="italic"
        fontWeight="700"
        fill="#221F1F"
        letterSpacing="1"
      >Safalta Ka Sankalp</text>

      {/* 4. BOTTOM RED ACCENT LINE */}
      <line x1="8" y1="74" x2="532" y2="74" stroke="#E11D23" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
