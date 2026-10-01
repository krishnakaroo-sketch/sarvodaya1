import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'mr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isMarathi: boolean;
  isEnglish: boolean;
  t: (key: string, defaultMarathi?: string, defaultEnglish?: string) => string;
}

export const TRANSLATIONS: Record<string, { mr: string; en: string }> = {
  // TopBar & Utilities
  'top.alumni': { mr: 'माजी विद्यार्थी', en: 'Alumni' },
  'top.studentPortal': { mr: 'विद्यार्थी कक्ष', en: 'Student Portal' },
  'top.careers': { mr: 'नोकरीच्या संधी', en: 'Careers' },
  'top.langLabel': { mr: 'भाषा निवडा', en: 'Select Language' },
  
  // Header
  'header.tagline': { mr: 'मध्य भारतातील अग्रगण्य शैक्षणिक संस्था संकुल', en: "Central India's Premier Educational Network" },
  'header.reg': { mr: 'नोंदणी क्र. एफ-१०७ (चंद्रपूर)', en: 'Trust Reg. No. F-107 (Chandrapur)' },
  'header.mandalName': { mr: 'सर्वोदय शिक्षण मंडळ, चंद्रपूर', en: 'Sarvodaya Shikshan Mandal, Chandrapur' },
  'header.location': { mr: 'चंद्रपूर, महाराष्ट्र', en: 'Chandrapur, Maharashtra' },
  'header.est': { mr: 'स्थापना: १९८३', en: 'Est. 1983' },

  // Navigation
  'nav.home': { mr: 'मुख्य पृष्ठ', en: 'Home' },
  'nav.about': { mr: 'संस्थेविषयी', en: 'About Mandal' },
  'nav.history': { mr: 'इतिहास आणि वारसा', en: 'History & Heritage' },
  'nav.vision': { mr: 'ध्येय आणि उद्दिष्टे', en: 'Vision & Mission' },
  'nav.management': { mr: 'नियामक मंडळ (कार्यकारिणी)', en: 'Board of Directors' },
  'nav.presidentMessage': { mr: 'अध्यक्षांचे मनोगत', en: "President's Message" },
  'nav.workingPresidentMessage': { mr: 'कार्याध्यक्षांचे मनोगत', en: "Working President's Message" },
  'nav.vicePresidentMessage': { mr: 'उपाध्यक्षांचे मनोगत', en: "Vice Presidents' Messages" },
  'nav.secretaryMessage': { mr: 'सचिवांचे मनोगत', en: "Secretary's Message" },
  'nav.jointSecretaryMessage': { mr: 'सहसचिवांचे मनोगत', en: "Joint Secretary's Message" },
  'nav.treasurerMessage': { mr: 'कोषाध्यक्षांचे मनोगत', en: "Treasurer's Message" },
  'nav.allLeadership': { mr: 'सर्व पदाधिकारी मनोगत', en: 'All Leadership Messages' },
  'nav.adminStaff': { mr: 'प्रशासकीय कार्यालय व कर्मचारी', en: 'Administrative Office & Staff' },
  'nav.institutions': { mr: 'आमच्या शिक्षण संस्था', en: 'Our Institutions' },
  'nav.allInstitutions': { mr: 'सर्व शैक्षणिक संस्था व निर्देशिका (११ संस्था)', en: 'All Institutions & Directory (11 Institutions)' },
  'nav.media': { mr: 'वृत्त व घडामोडी', en: 'Media & Updates' },
  'nav.news': { mr: 'बातम्या व सूचना', en: 'News & Announcements' },
  'nav.events': { mr: 'आगामी कार्यक्रम', en: 'Upcoming Events' },
  'nav.gallery': { mr: 'छायाचित्र दालन', en: 'Photo Gallery' },
  'nav.careers': { mr: 'नोकरीच्या संधी', en: 'Careers' },
  'nav.contact': { mr: 'संपर्क', en: 'Contact' },
  'nav.menu': { mr: 'सूची (मेनू)', en: 'Menu' },

  // Announcements
  'announcements.title': { mr: 'नवीन सूचना व घडामोडी', en: 'Latest News & Announcements' },
  'announcements.badge': { mr: 'नवीन', en: 'NEW' },
  'announcements.viewAll': { mr: 'सर्व सूचना पहा', en: 'View All Announcements' },

  // Hero Section
  'hero.preTitle': { mr: 'ज्ञान, संस्कार आणि प्रगतीची समृद्ध परंपरा', en: 'Excellence in Higher Education & Research' },
  'hero.title': { mr: 'सर्वोदय शिक्षण मंडळ, चंद्रपूर', en: 'Sarvodaya Shikshan Mandal, Chandrapur' },
  'hero.subtitle': { mr: '४ दशकांहून अधिक काळ पूर्व विदर्भातील विद्यार्थ्यांना दर्जेदार शिक्षण, मूल्यसंस्कार व व्यावसायिक प्रशिक्षण देणारी अग्रगण्य शिक्षण संस्था.', en: 'Empowering generations of learners in Chandrapur with values, modern infrastructure, and academic excellence since 1983.' },
  'hero.exploreBtn': { mr: 'आमच्या शिक्षण संस्था पहा', en: 'Explore Institutions' },
  'hero.aboutBtn': { mr: 'मंडळाविषयी अधिक माहिती', en: 'About Mandal' },

  // Sections
  'section.institutionsTitle': { mr: 'आमच्या शिक्षण संस्था व महाविद्यालये', en: 'Our Educational Network & Institutions' },
  'section.institutionsSubtitle': { mr: 'वरिष्ठ महाविद्यालये, कनिष्ठ महाविद्यालये आणि प्राथमिक व माध्यमिक शाळांचा शैक्षणिक परिवार', en: 'Network of senior degree colleges, junior colleges, and secondary schools' },
  'section.leadershipTitle': { mr: 'संस्था नियामक मंडळ व संदेश', en: 'Leadership & Vision Messages' },
  'section.leadershipSubtitle': { mr: 'सर्वोदय शिक्षण मंडळाचे सन्माननीय पदाधिकारी व त्यांचे विद्यार्थ्यांना मार्गदर्शन', en: 'Messages from our respected President, Secretary, and Board of Directors' },
  'section.statsTitle': { mr: 'संस्थेची ठळक वैशिष्ट्ये', en: 'Key Milestones & Impact' },
  'section.statsSubtitle': { mr: 'हजारो विद्यार्थ्यांचे भविष्य घडविणारी संस्था', en: 'Numbers that define our educational legacy in Chandrapur' },
  'section.testimonialsTitle': { mr: 'विद्यार्थी व पालकांचे मनोगत', en: 'Voices of Alumni & Parents' },
  'section.testimonialsSubtitle': { mr: 'सर्वोदयीन कुटुंबाचा अभिमान', en: 'Testimonials of success and holistic development' },

  // Institutions Section Filter
  'inst.allTab': { mr: 'सर्व संस्था (११)', en: 'All Institutions (11)' },
  'inst.collegesTab': { mr: 'वरिष्ठ महाविद्यालये', en: 'Senior Colleges' },
  'inst.schoolsTab': { mr: 'शाळा व कनिष्ठ महाविद्यालये', en: 'Schools & Jr Colleges' },
  'inst.searchPlaceholder': { mr: 'शाळा, महाविद्यालय किंवा प्राचार्यांचे नाव शोधा...', en: 'Search institution or principal name...' },
  'inst.viewPage': { mr: 'संस्थेचे स्वतंत्र पृष्ठ पहा', en: 'View Institution Page' },
  'inst.visitWebsite': { mr: 'अधिकृत संकेतस्थळ', en: 'Official Website' },
  'inst.principal': { mr: 'प्राचार्य / मुख्याध्यापक', en: 'Principal / Head' },
  'inst.contact': { mr: 'संपर्क', en: 'Contact' },
  'inst.courses': { mr: 'उपलब्ध अभ्यासक्रम', en: 'Courses Offered' },
  'inst.facilities': { mr: 'कॅम्पस सुविधा', en: 'Campus Facilities' },

  // Leadership Messages
  'lead.readFullMessage': { mr: 'संपूर्ण मनोगत वाचा', en: 'Read Full Message' },
  'lead.presidentTag': { mr: 'संस्था अध्यक्ष', en: 'President' },
  'lead.workingPresidentTag': { mr: 'संस्था कार्याध्यक्ष', en: 'Working President' },
  'lead.vicePresidentTag': { mr: 'संस्था उपाध्यक्ष', en: 'Vice President' },
  'lead.secretaryTag': { mr: 'संस्था सचिव', en: 'Secretary' },
  'lead.jointSecretaryTag': { mr: 'संस्था सहसचिव', en: 'Joint Secretary' },
  'lead.treasurerTag': { mr: 'संस्था कोषाध्यक्ष', en: 'Treasurer' },

  // Footer
  'footer.aboutTitle': { mr: 'सर्वोदय शिक्षण मंडळ, चंद्रपूर', en: 'Sarvodaya Shikshan Mandal' },
  'footer.aboutDesc': { mr: 'सर्वोदय शिक्षण मंडळ, चंद्रपूर ही चंद्रपूर जिल्ह्यातील शैक्षणिक, सामाजिक व सांस्कृतिक विकासासाठी कटिबद्ध असणारी अग्रगण्य संस्था आहे.', en: 'Sarvodaya Shikshan Mandal, Chandrapur is committed to academic, social, and ethical development across Central India.' },
  'footer.quickLinks': { mr: 'महत्त्वाचे दुवे', en: 'Quick Links' },
  'footer.ourInstitutions': { mr: 'संस्था शाखा', en: 'Our Institutions' },
  'footer.contactInfo': { mr: 'संपर्क कार्यालय', en: 'Central Office' },
  'footer.copyright': { mr: 'सर्व हक्क राखीव. सर्वोदय शिक्षण मंडळ, चंद्रपूर.', en: 'All Rights Reserved. Sarvodaya Shikshan Mandal, Chandrapur.' },
  'footer.developed': { mr: 'डिजिटल व्यवस्थापन व संचालन प्रणाली', en: 'Digital Management & Portal System' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'mr',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isMarathi: true,
  isEnglish: false,
  t: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sarvodaya_lang');
    if (saved === 'en' || saved === 'mr') return saved;
    return 'mr'; // Default to Marathi as requested for local institutional authenticity
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sarvodaya_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'mr' ? 'en' : 'mr';
    setLanguage(next);
  };

  const isMarathi = language === 'mr';
  const isEnglish = language === 'en';

  const t = (key: string, defaultMarathi?: string, defaultEnglish?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry) {
      return language === 'mr' ? entry.mr : entry.en;
    }
    if (language === 'mr' && defaultMarathi) return defaultMarathi;
    if (language === 'en' && defaultEnglish) return defaultEnglish;
    return defaultMarathi || defaultEnglish || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isMarathi,
        isEnglish,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
