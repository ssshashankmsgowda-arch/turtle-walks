import React, { useEffect, useRef, useState } from 'react';

interface InitiativesSectionProps {
  onJoin?: () => void;
  onInitiativeClick?: (id: string) => void;
}

const INITIATIVES = [
// ... (INITIATIVES array remains same, handled by diff context usually, but repeating to be safe if strictly required, simplified here for replace_content)
  {
    id: 'cleanup',
    title: 'Beach Cleanups',
    titleHtml: <><span className="border-b-4 border-[#F97316]/80 pb-1">Beach</span> Cleanups</>,
    image: '/assets/cleanup_cover.png',
    alt: 'Volunteers cleaning beach',
    buttonText: 'Join Us',
    action: 'join'
  },
  {
    id: 'turtle',
    title: 'Turtle Walks',
    titleHtml: <>Turtle <span className="border-b-4 border-[#0EA5E9]/80 pb-1">Walks</span></>,
    image: '/assets/turtle_cover.png',
    alt: 'Baby turtle on sand',
    buttonText: 'Learn More',
    action: 'learn'
  },
  {
    id: 'sand',
    title: 'Sand Sculpture Contest',
    titleHtml: <>Sand <span className="border-b-4 border-purple-500/80 pb-1">Sculpture Contest</span></>,
    image: '/assets/sand_sculpture.png',
    alt: 'Turtle sand sculpture',
    buttonText: 'Learn More',
    action: 'learn'
  }
];

export const InitiativesSection: React.FC<InitiativesSectionProps> = ({ onJoin, onInitiativeClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollAllowed = useRef(true);

  // Create 5 copies for infinite scroll illusion
  const DISPLAY_ITEMS = [...INITIATIVES, ...INITIATIVES, ...INITIATIVES, ...INITIATIVES, ...INITIATIVES];

  // Auto-scroll logic (unchanged)
  useEffect(() => {
    const intervalTime = 3000;
    
    const scrollToNextCard = () => {
        if (isHovering || !autoScrollAllowed.current) return;
        
        const container = scrollContainerRef.current;
        if (!container) return;
        
        const wrapper = container.firstElementChild as HTMLElement;
        if (!wrapper || wrapper.children.length === 0) return;

        const card = wrapper.children[0] as HTMLElement;
        const style = window.getComputedStyle(wrapper);
        const gap = parseFloat(style.gap) || 24; 
        const itemWidth = card.offsetWidth + gap;
        const maxScroll = container.scrollWidth / 2;

        container.scrollBy({ left: itemWidth, behavior: 'smooth' });

        if (container.scrollLeft >= maxScroll) {
             setTimeout(() => {
                 if (container.scrollLeft >= maxScroll) {
                     container.style.scrollBehavior = 'auto';
                     container.scrollLeft = 0;
                     container.style.scrollBehavior = 'smooth';
                 }
             }, 500); 
        }
    };

    const intervalId = setInterval(scrollToNextCard, intervalTime);
    return () => clearInterval(intervalId);
  }, [isHovering]);

  const scrollInitiatives = (direction: 'left' | 'right') => {
    autoScrollAllowed.current = false;
    setTimeout(() => autoScrollAllowed.current = true, 4000);

    const container = scrollContainerRef.current;
    if (!container) return;
    
    const wrapper = container.firstElementChild as HTMLElement;
    if (!wrapper) return;

    const card = wrapper.children[0] as HTMLElement;
    const cardWidth = card?.offsetWidth || 300;
    const itemWidth = cardWidth + 24;

    if (direction === 'left') {
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  const handleCardClick = (item: typeof INITIATIVES[0]) => {
    // If clicking "Join Us" on cleanup, prioritize the Join action (Form)
    // But user asked for details card too. Let's make "Join Us" button go to Join Form, and Card go to Details.
    // Actually, "Join Us" in the cards was sending to onJoin previously.
    // Let's refine:
    // - Card Click: Go to Details
    // - Button Click (Join): Go to Registration Form
    // - Button Click (Learn More): Go to Details
    
    if (item.action === 'join') {
        // For cleanup, button is Join.
        if (onJoin) onJoin();
    } else {
        // Learn more
        if (onInitiativeClick) onInitiativeClick(item.id);
    }
  };

  return (
    <section className="w-full py-12 pb-24 bg-[#F0F9FF] dark:bg-[#0F172A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex justify-between items-end">
        <h2 className="font-['DM_Serif_Display'] text-4xl text-slate-900 dark:text-white">Explore Initiatives</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollInitiatives('left')}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            type="button"
          >
            <span className="material-icons-outlined text-sm">arrow_back_ios_new</span>
          </button>
          <button 
            onClick={() => scrollInitiatives('right')}
            className="w-10 h-10 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
            type="button"
          >
            <span className="material-icons-outlined text-sm">arrow_forward_ios</span>
          </button>
        </div>
      </div>
      
      <div 
        id="initiatives-scroll-container"
        ref={scrollContainerRef}
        className="pl-4 sm:pl-6 lg:pl-8 overflow-x-auto no-scrollbar pb-8 scroll-smooth"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex gap-6 w-max pr-8">
          {DISPLAY_ITEMS.map((item, index) => (
             <div 
                key={`${item.id}-${index}`}
                onClick={() => onInitiativeClick && onInitiativeClick(item.id)}
                className="relative w-[300px] md:w-[600px] h-[450px] md:h-[500px] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl transition-all hover:scale-[1.01]"
              >
                <img 
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={item.image} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                  <h3 className="font-['DM_Serif_Display'] text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                    {item.titleHtml}
                  </h3>
                  <button
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (item.action === 'join' && onJoin) onJoin();
                        else if (onInitiativeClick) onInitiativeClick(item.id);
                    }}
                    className={`w-fit font-bold px-8 py-3.5 rounded-full transition-all transform hover:-translate-y-1 flex items-center gap-2 
                        ${item.action === 'join' 
                            ? 'bg-[#0EA5E9] hover:bg-sky-500 text-slate-900 group-hover:bg-white group-hover:text-slate-900' 
                            : 'border-2 border-white/40 hover:bg-white hover:border-white hover:text-slate-900 text-white'
                        }`}
                    type="button"
                  >
                    {item.buttonText}
                    <span className="material-icons-outlined text-xl">arrow_forward</span>
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
};
