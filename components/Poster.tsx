import React from 'react';
import { UserData, Pledge, School } from '../types';

/* 
  POSTER COMPONENT - Uses image from public/assets/poster.png
  The image path is simple (no spaces) to ensure it works in production.
*/

interface PosterProps {
  id?: string;
  userData: UserData;
  school?: School | null;
  pledge?: Pledge;
  className?: string;
  showPlaceholderText?: boolean;
}

export const Poster: React.FC<PosterProps> = ({ id, userData, school, className = '', showPlaceholderText = true }) => {
  // Enforcing standard poster style regardless of input
  
  return (
    <div
      id={id || 'certificate-visual'}
      className={`relative aspect-[1080/1600] bg-white overflow-hidden text-gray-900 mx-auto shadow-sm ${className}`}
    >
      {console.log('🖼️ Poster Rendered:', { userData, photo: userData.photo ? 'Present' : 'Missing' })}

      {/* Layer 1: Background Image */}
      <img
        src="/assets/poster.png"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />

      {/* Layer 2: Dynamic User Photo */}
      <div
        className="absolute rounded-lg overflow-hidden z-10 flex items-center justify-center bg-gray-100/50"
        style={{
          // Standard School Poster Photo Coordinates
          left: '26.07%',
          top: '30.31%',
          width: '40.78%',
          height: '27.59%'
        }}
      >
        {userData.photo ? (
          <img
            src={userData.photo}
            className="w-full h-full object-cover"
            alt="User Photo"
          />
        ) : (
          showPlaceholderText && (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-center p-4">
              <span className="text-gray-500 font-bold text-2xl leading-tight">Please add your photo</span>
            </div>
          )
        )}
      </div>

      {/* Layer 3: Dynamic User Name */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          // Standard School Poster Coordinates (1080x1600) - FORCE CENTER ALIGNMENT
          left: '50%',
          top: '59%', 
          width: 'auto',
          minWidth: '60%',
          transform: 'translateX(-50%)',
          height: '6.04%'
        }}
      >
        <h2
          className="text-black font-bold tracking-wide leading-none w-full text-center px-1"
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontWeight: 550,
            whiteSpace: 'nowrap',
            fontSize: (userData.fullName || 'Ram Kumar').length > 20 ? '14px' : (userData.fullName || 'Ram Kumar').length > 13 ? '20px' : '24px'
          }}
        >
          {userData.fullName || 'Ram Kumar'}
        </h2>
      </div>



    </div >
  );
};