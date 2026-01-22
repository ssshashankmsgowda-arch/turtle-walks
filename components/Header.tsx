import React from 'react';


interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <nav className="sticky top-0 inset-x-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-300 bg-white/70 backdrop-blur-lg border-b border-stone-100/50 supports-[backdrop-filter]:bg-white/50">

      {/* Logo - Clickable to go home */}
      <div
        className="flex items-center gap-3 group cursor-pointer"
        onClick={onLogoClick}
      >
        <span className="font-display font-bold text-xl text-indiaNavy tracking-tight group-hover:text-saffron transition-colors">
          My Flag Pledge
        </span>
      </div>

    </nav>
  );
};