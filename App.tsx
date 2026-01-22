import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import { DirectoryPage } from './pages/DirectoryPage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FlagCode } from './components/FlagCode';
import { Footer } from './components/Footer';
import { UserForm } from './components/UserForm';
import { CertificatePreview } from './components/CertificatePreview';
import { PledgeReading } from './components/PledgeReading';
import { Success } from './components/Success';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { UserData, Step } from './types';
import { saveUserData } from './services/dataStore';
import { DB } from './services/db';
import { useApp } from './context/AppContext';

// 🚀 Performance: Preload critical assets on app mount
const preloadAssets = () => {
  const imagesToPreload = ['/assets/poster_bg.png'];
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// 🚀 Performance: Wait one frame before heavy work (shows loading state first)
const runAfterPaint = (callback: () => void) => {
  setTimeout(callback, 16); // ~1 frame at 60fps
};

const App: React.FC = () => {
  const { setSelectedSchool } = useApp(); // Access context here
  const [currentStep, setCurrentStep] = useState<Step>(Step.Home);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    class: '',
    section: '',
    countryCode: '+91',
    photo: ''
  });

  // 🚀 Preload assets on mount and set title
  useEffect(() => {
    preloadAssets();
    document.title = "Flag Pledge Initiative | Take the Pledge for Our National Flag 🇮🇳";
  }, []);

  // 🚀 Smooth step transition with fade effect
  const goToStep = useCallback((step: Step) => {
    setIsTransitioning(true);
    runAfterPaint(() => {
      setCurrentStep(step);
      window.scrollTo(0, 0);
      // Allow CSS transition to complete
      setTimeout(() => setIsTransitioning(false), 50);
    });
  }, []);

  const handleStart = () => goToStep(Step.Directory);

  const handleDirectorySelect = () => goToStep(Step.Form);

  const handleSchoolSelect = (schoolId: string) => {
    // Direct navigation handler for homepage featured cards
    const school = DB.getSchoolById(schoolId);
    if (school) {
      setSelectedSchool(school);
      goToStep(Step.Form);
    } else {
      goToStep(Step.Directory);
    }
  }

  const handleFormSubmit = () => goToStep(Step.Preview);

  const handlePreviewConfirm = () => goToStep(Step.Reading);

  const handlePledgeConfirm = async () => {
    setIsTransitioning(true);
    await saveUserData(userData);
    runAfterPaint(() => {
      setCurrentStep(Step.Success);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 50);
    });
  };

  const handleReset = () => {
    setUserData({
      fullName: '',
      email: '',
      phone: '',
      class: '',
      section: '',
      countryCode: '+91',
      photo: ''
    });
    goToStep(Step.Home);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      <Header onLogoClick={handleReset} />

      {/* 🚀 Main content with CSS fade transition */}
      <main
        className={`flex-1 transition-opacity duration-200 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
      >
        {currentStep === Step.Home && (
          <>
            <Hero onStart={handleStart} />

            {/* PARTNER INSTITUTIONS SECTION */}
            <section className="py-20 px-6 bg-white border-b border-stone-100">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-900 border-b-4 border-green-600 inline-block pb-2">
                      PARTNER<br />INSTITUTIONS
                    </h2>
                  </div>
                  <button
                    onClick={() => goToStep(Step.Directory)}
                    className="hidden md:flex items-center gap-2 text-stone-500 font-bold text-sm tracking-wider hover:text-orange-600 transition-colors"
                  >
                    VIEW ALL SCHOOLS →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FEATUREED SCHOOLS ONLY */}
                  {DB.getSchools().filter(s => s.isFeatured).slice(0, 3).map((school, index) => (
                    <div
                      key={school.id}
                      className="group relative bg-white rounded-2xl p-6 shadow-sm border border-stone-100 transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden cursor-pointer"
                      onClick={() => handleSchoolSelect(school.id)}
                    >
                      {/* Gradient Border Effect on Hover */}
                      <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-orange-100 transition-colors pointer-events-none" />

                      {/* Subtle Background Gradient */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${index === 0 ? 'from-orange-50/50 via-transparent to-transparent' :
                        index === 1 ? 'from-blue-50/50 via-transparent to-transparent' :
                          'from-green-50/50 via-transparent to-transparent'
                        }`} />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-white/50 transition-transform duration-300 group-hover:scale-110 ${index === 0 ? 'bg-orange-50 text-orange-600' :
                            index === 1 ? 'bg-blue-50 text-blue-600' :
                              'bg-green-50 text-green-600'
                            }`}>
                            {school.logoUrl ? <img src={school.logoUrl} className="w-full h-full object-contain p-3" /> : school.icon}
                          </div>

                          {/* Verified Badge */}
                          <div className="text-blue-500 bg-blue-50 p-1 rounded-full">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">{school.name}</h3>

                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 mb-8">
                          <svg className="text-stone-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {school.location}
                        </p>

                        <div className="w-full py-3.5 bg-stone-900 text-white font-bold text-center rounded-xl text-sm tracking-wide transition-all group-hover:bg-[#1E8F43] group-hover:shadow-lg group-hover:shadow-green-900/20">
                          Create Tribute
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center md:hidden">
                  <button
                    onClick={() => goToStep(Step.Directory)}
                    className="text-stone-500 font-bold text-sm tracking-wider"
                  >
                    VIEW ALL SCHOOLS →
                  </button>
                </div>
              </div>
            </section>

            <FlagCode />
          </>
        )}

        {currentStep === Step.Directory && (
          <DirectoryPage
            onBack={() => goToStep(Step.Home)}
            onSelect={handleDirectorySelect}
          />
        )}

        {currentStep === Step.Form && (
          <>
            <UserForm
              userData={userData}
              setUserData={setUserData}
              onBack={() => goToStep(Step.Home)}
              onContinue={handleFormSubmit}
            />
            <FlagCode />
          </>
        )}

        {currentStep === Step.Preview && (
          <CertificatePreview
            userData={userData}
            onBack={() => goToStep(Step.Form)}
            onConfirm={handlePreviewConfirm}
          />
        )}

        {currentStep === Step.Reading && (
          <PledgeReading
            userData={userData}
            onBack={() => goToStep(Step.Preview)}
            onConfirm={handlePledgeConfirm}
          />
        )}

        {currentStep === Step.Success && (
          <Success
            userData={userData}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer onPrivacyClick={() => setShowPrivacyPolicy(true)} />

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default AppWrapper;