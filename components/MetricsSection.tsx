import React, { useState, useEffect } from 'react';

const metricsData = [
  {
    tag: "Conservation Impact",
    title: "Hatchlings Released",
    value: "200k+",
    unit: "turtles",
    unitIcon: "pets",
    desc: "Over three decades of protecting nests and safely releasing Olive Ridley hatchlings into the ocean.",
    color: "text-primary",
    unitColor: "text-primary",
    bgIcon: "water_drop"
  },
  {
    tag: "Our History",
    title: "Years of Service",
    value: "35+",
    unit: "years",
    unitIcon: "",
    desc: "A consistent, community-led effort since 1988 to preserve Chennai's coastal biodiversity.",
    color: "text-secondary",
    unitColor: "text-secondary",
    bgIcon: "history"
  },
  {
    tag: "Daily Effort",
    title: "Distance Patrolled",
    value: "14",
    unit: "km/night",
    unitIcon: "",
    desc: "Volunteers cover the stretch from Neelangarai to Besant Nagar every night during nesting season.",
    color: "text-emerald-400",
    unitColor: "text-emerald-500/80",
    bgIcon: "map"
  },
  {
    tag: "Community",
    title: "Volunteers",
    value: "10k+",
    unit: "people",
    unitIcon: "",
    desc: "Students, working professionals, and families coming together to make a difference.",
    color: "text-teal-400",
    unitColor: "text-teal-500/80",
    bgIcon: "diversity_3"
  }
];

export const MetricsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % metricsData.length);
        setIsAnimating(false);
      }, 300); // Wait for fade out
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const mainData = metricsData[currentIndex];
  
  // Get next 3 items
  const nextItems = [1, 2, 3].map(offset => metricsData[(currentIndex + offset) % metricsData.length]);

  return (
    <section className="bg-slate-900 py-20 px-4 flex items-center justify-center" id="impact">
      <div className="max-w-7xl w-full mx-auto relative">
        <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-700/50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Main Feature */}
            <div className="relative p-6 md:p-12 lg:p-16 flex flex-col justify-center min-h-[400px] lg:min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
              {/* Pattern overlay simulated with CSS radial/linear gradients or just skipped if image not avail. 
                  Using simple dots pattern fallback or empty div */}
              <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" 
                   style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {/* Dynamic Main Content */}
              <div 
                className={`relative z-10 transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}
              >
                <span className="text-secondary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
                  {mainData.tag}
                </span>
                <h3 className="text-2xl md:text-4xl font-medium text-white mb-8">
                  {mainData.title}
                </h3>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="font-display text-5xl md:text-8xl font-bold text-white tracking-tight">
                    {mainData.value}
                  </span>
                  {mainData.unitIcon ? (
                     <span className={`material-icons-round text-3xl md:text-6xl transform translate-y-2 ${mainData.unitColor}`}>
                       {mainData.unitIcon}
                     </span>
                  ) : (
                     <span className={`text-3xl md:text-5xl font-bold ml-2 ${mainData.unitColor}`}>
                       {mainData.unit}
                     </span>
                  )}
                </div>
                <p className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed">
                  {mainData.desc}
                </p>
                  <button className="inline-flex items-center justify-center bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors duration-300 w-fit group" type="button">
                  Become a Volunteer
                  <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Right Side: List */}
            <div className="relative p-6 md:p-12 lg:p-16 flex items-center bg-slate-800/50 border-t lg:border-t-0 lg:border-l border-slate-700/50 min-h-[400px] lg:min-h-[500px]">
               <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(square, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              <div className="relative w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-10 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                  <span className="material-icons-round text-8xl text-primary rotate-12 transition-all duration-700">
                    {mainData.bgIcon}
                  </span>
                </div>
                
                {/* Dynamic List Content */}
                <div className="relative z-10 space-y-10">
                  {nextItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex items-center justify-between group cursor-default transition-all duration-300 hover:translate-x-1">
                            <div>
                                <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">{item.tag}</p>
                                <h4 className="text-lg md:text-2xl font-semibold text-white">{item.title}</h4>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className={`block font-display text-3xl md:text-5xl ${item.color} font-bold transform transition-transform group-hover:scale-105 origin-right`}>{item.value}</span>
                                    {item.unit && <span className={`text-base md:text-xl ${item.unitColor} font-medium`}>{item.unit}</span>}
                                </div>
                            </div>
                        </div>
                        {idx < 2 && (
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
                        )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
