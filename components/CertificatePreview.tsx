import React from 'react';
import { useApp } from '../context/AppContext';
import { UserData, FIXED_PLEDGE } from '../types';
import { Poster } from './Poster';
import { Edit2, CheckCircle2 } from 'lucide-react';

interface PreviewProps {
  userData: UserData;
  onBack: () => void;
  onConfirm: () => void;
}

export const CertificatePreview: React.FC<PreviewProps> = ({ userData, onBack, onConfirm }) => {

  return (
    <div className="min-h-screen bg-canvas pt-20 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <button onClick={onBack} className="text-subText hover:text-indiaNavy font-medium" type="button">
            ← Edit Details
          </button>
          <div className="text-sm font-semibold text-saffron bg-saffron/10 px-3 py-1 rounded-full">
            Step 2 of 3
          </div>
        </div>

        <h2 className="text-2xl font-display font-bold text-indiaNavy mb-2 text-center">Preview Certificate</h2>
        <p className="text-stone-500 mb-8 text-center text-sm">Review your details carefully. This is how your certificate will look.</p>

        {/* Preview Container */}
        {/* We simply constrain the width here. The Poster component handles aspect ratio and scaling. */}
        <div className="w-full max-w-[350px] shadow-2xl rounded-lg overflow-hidden mb-8 bg-white border border-gray-100">
          <Poster userData={userData} pledge={FIXED_PLEDGE} />
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 bg-white border border-stone-200 text-stone-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            type="button"
          >
            <Edit2 size={18} /> Modify
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-gradient-to-r from-saffron to-[#f97316] text-white font-bold rounded-xl shadow-lg shadow-saffron/20 flex items-center justify-center gap-2 hover:shadow-saffron/30 transition-all"
            type="button"
          >
            Looks Good <CheckCircle2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};