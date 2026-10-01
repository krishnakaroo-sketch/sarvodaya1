import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'navbar' | 'compact' | 'mobile' | 'light';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'topbar',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center rounded-lg p-0.5 bg-emerald-900/60 border border-emerald-700/40 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
            language === 'mr'
              ? 'bg-amber-400 text-emerald-950 shadow-sm'
              : 'text-emerald-200 hover:text-white'
          }`}
          title="मराठी मध्ये वाचा"
        >
          मराठी
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
            language === 'en'
              ? 'bg-amber-400 text-emerald-950 shadow-sm'
              : 'text-emerald-200 hover:text-white'
          }`}
          title="Read in English"
        >
          EN
        </button>
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
          <Globe size={14} className="text-emerald-600" />
        </div>
        <div className="inline-flex items-center p-1 bg-slate-100 border border-slate-200 rounded-full shadow-inner">
          <button
            type="button"
            onClick={() => setLanguage('mr')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              language === 'mr'
                ? 'bg-white text-emerald-800 shadow-sm font-black ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-200/50'
            }`}
          >
            <span>मराठी</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              language === 'en'
                ? 'bg-white text-emerald-800 shadow-sm font-black ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-200/50'
            }`}
          >
            <span>English</span>
          </button>
        </div>
      </div>
    );
  }

  // Primary top bar segmented tab
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
        <Globe size={13} className="text-amber-400" />
        <span className="tracking-wide">{language === 'mr' ? 'भाषा:' : 'Language:'}</span>
      </div>

      <div
        role="tablist"
        aria-label="Language selection"
        className="inline-flex items-center p-1 bg-black/40 border border-white/20 rounded-full shadow-inner backdrop-blur-md"
      >
        <button
          type="button"
          role="tab"
          aria-selected={language === 'mr'}
          onClick={() => setLanguage('mr')}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            language === 'mr'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-black ring-1 ring-amber-300/50'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="text-sm leading-none">🇮🇳</span>
          <span>मराठी</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={language === 'en'}
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            language === 'en'
              ? 'bg-amber-400 text-emerald-950 shadow-md font-black ring-1 ring-amber-300/50'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>English</span>
        </button>
      </div>
    </div>
  );
};
