import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "./components/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Users,
  Building,
  ExternalLink,
  Bell,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  Target,
  Compass,
  ChevronDown,
  Calendar,
  Image as ImageIcon,
  Heart,
  Quote,
  Globe,
  Trophy,
  ArrowUp,
  Star,
  Settings,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle2,
  MessageCircle,
  FileText,
  Download,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  fetchAnnouncements,
  fetchEvents,
  fetchInstitutions,
  fetchContentBlocks,
  fetchCareers,
  fetchAdvertisementPdf,
  submitJobApplication,
  submitInquiry,
  getDownloadUrl
} from "./lib/api";
import { JobApplicationPage } from "./components/JobApplicationPage";
import { ExecutiveCommitteeSection } from "./components/ExecutiveCommitteeSection";
import { InstitutionsSection } from "./components/InstitutionsSection";
import { LeadershipMessages } from "./components/LeadershipMessages";
import { InstitutionDetailView } from "./components/InstitutionDetailView";
import { AlumniPortal } from "./components/AlumniPortal";
import {
  MANDAL_REGISTRATION,
  EXECUTIVE_COMMITTEE,
  MANDAL_INSTITUTIONS,
} from "./data/mandalData";
import { useLanguage } from "./context/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const WhatsApp = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.062-.301-.15-1.265-.464-2.406-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.502.098-.203.048-.379-.029-.523-.071-.15-.672-1.62-.922-2.206-.24-.579-.492-.501-.672-.51l-.573-.008c-.198 0-.52.074-.792.359-.271.285-1.045 1.016-1.045 2.479 0 1.462 1.069 2.875 1.215 3.074.149.195 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const TopBar = ({ content }: { content: Record<string, string> }) => {
  const { isMarathi, t } = useLanguage();

  return (
    <div className="bg-emerald-950 text-slate-300 py-2 md:py-2.5 px-4 text-xs font-medium tracking-wider border-b border-white/10 relative z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Contact Info */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer">
            <Phone size={13} className="text-amber-400 shrink-0" />{" "}
            {content["Contact_Phone"] || "07172 - 255778"}
          </span>
          <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer">
            <Mail size={13} className="text-amber-400 shrink-0" />{" "}
            {content["Contact_Email"] || "sarvodayashikshanmandal@gmail.com"}
          </span>
        </div>

        {/* Center / Right: High-prominence Language Switcher Tab + Utilities */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          {/* Utility Quick Links & Socials */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] uppercase tracking-widest font-bold">
            <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
              {content["Social_Facebook"] && (
                <a
                  href={content["Social_Facebook"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white"
                >
                  <Facebook size={14} />
                </a>
              )}
              {content["Social_Twitter"] && (
                <a
                  href={content["Social_Twitter"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white"
                >
                  <Twitter size={14} />
                </a>
              )}
              {content["Social_Instagram"] && (
                <a
                  href={content["Social_Instagram"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white"
                >
                  <Instagram size={14} />
                </a>
              )}
              {content["Social_LinkedIn"] && (
                <a
                  href={content["Social_LinkedIn"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white"
                >
                  <Linkedin size={14} />
                </a>
              )}
              {content["Social_YouTube"] && (
                <a
                  href={content["Social_YouTube"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white"
                >
                  <Youtube size={14} />
                </a>
              )}
              {!content["Social_Facebook"] && !content["Social_Twitter"] && !content["Social_Instagram"] && !content["Social_LinkedIn"] && !content["Social_YouTube"] && (
                <>
                  <a href="#" className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white">
                    <Facebook size={14} />
                  </a>
                  <a href="#" className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white">
                    <Twitter size={14} />
                  </a>
                  <a href="#" className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white">
                    <Instagram size={14} />
                  </a>
                  <a href="#" className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white">
                    <Linkedin size={14} />
                  </a>
                  <a href="#" className="hover:text-amber-400 transition-colors text-slate-400 hover:text-white">
                    <Youtube size={14} />
                  </a>
                </>
              )}
            </div>

            <Link
              to="/alumni"
              className="hover:text-amber-400 transition-colors text-slate-300"
            >
              {t("top.alumni", "माजी विद्यार्थी", "Alumni")}
            </Link>
            <span className="text-white/20">|</span>
            <Link
              to={content["Nav_StudentPortal_URL"] || "/"}
              className="hover:text-amber-400 transition-colors text-slate-300"
            >
              {t("top.studentPortal", "विद्यार्थी कक्ष", "Student Portal")}
            </Link>
            <span className="text-white/20">|</span>
            <Link
              to="/careers"
              className="hover:text-amber-400 transition-colors text-slate-300"
            >
              {t("top.careers", "नोकरीच्या संधी", "Careers")}
            </Link>
            <span className="text-white/20">|</span>
            <Link
              to="/admin"
              className="hover:text-emerald-400 transition-colors text-amber-500 font-bold flex items-center gap-1"
            >
              <Settings size={12} /> {isMarathi ? "प्रशासक" : "Admin"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ content }: { content: Record<string, string> }) => {
  const { isMarathi } = useLanguage();

  return (
    <div className="bg-white py-5 md:py-6 px-4 md:px-8 relative overflow-hidden shadow-sm">
      {/* Stunning Colorful Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-200/30 via-emerald-100/20 to-transparent rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none blur-[60px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-200/20 via-transparent to-transparent rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none blur-[50px]" />

      {/* Language Switcher - Top Right Corner */}
      <div className="absolute top-3 right-3 md:top-5 md:right-6 z-20">
        <LanguageSwitcher variant="light" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 relative z-10 text-center md:text-left mt-6 md:mt-0">
        {/* Heritage Emblem */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* Decorative halo around the logo */}
          <div className="absolute inset-0 bg-white/40 rounded-full blur-lg scale-125"></div>
          {(content["Org_Logo_URL"] || "/images/logo.png") ? (
            <ImageWithFallback
              src={content["Org_Logo_URL"] || "/images/logo.png"}
              alt="Logo"
              className="w-24 md:w-32 h-auto max-h-32 object-contain relative z-10"
            />
          ) : (
            <div className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center text-emerald-900 border-2 border-emerald-900/10 rounded-full bg-gradient-to-br from-white to-slate-50 shadow-md relative z-10">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-emerald-900 to-teal-700">
                {content["Org_ShortName"] || "SSM"}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center w-full max-w-5xl text-center md:text-left">
          {/* Eyebrow / Tagline */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500 hidden md:block opacity-80"></div>
            <span className="text-[10px] md:text-[11px] font-bold text-amber-700 uppercase tracking-[0.2em] leading-relaxed">
              {isMarathi
                ? (content["Org_Subtitle_Mr"] || "मध्य भारतातील अग्रगण्य शैक्षणिक संस्था संकुल")
                    .replace(/^(Trust Reg\. No\..*?•|रजि\.नं.*?•)\s*/i, '')
                    .replace(/^Trust Reg\. No\. F-09 \(C\) \(Chandrapur\)\s*•\s*/i, '')
                    .replace(/Central India's Premier Educational Network/i, 'मध्य भारतातील अग्रगण्य शैक्षणिक संस्था संकुल')
                    .replace(/^[•\s]+|[•\s]+$/g, '')
                    .trim()
                : (content["Org_Subtitle_En"] || "Central India's Premier Educational Network")
                    .replace(/^[•\s]+|[•\s]+$/g, '')
                    .trim()}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500 hidden md:block opacity-80"></div>
          </div>

          {/* Main Title - Vibrant Gradient */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-snug mb-3 text-emerald-800 drop-shadow-sm">
            {isMarathi
              ? (content["Org_Name_Mr"] || content["Org_Name"] || MANDAL_REGISTRATION.nameMarathi)
              : (content["Org_Name_En"] || MANDAL_REGISTRATION.nameEnglish)}
          </h1>

          {/* Secondary Registration Label & Location & Establishment */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
            <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] sm:text-xs font-bold text-white tracking-widest shadow-sm border border-amber-400/50">
              {isMarathi
                ? `नोंदणी क्र. ${MANDAL_REGISTRATION.regNo} (चंद्रपूर)`
                : `Trust Registration No. ${MANDAL_REGISTRATION.regNo} (Chandrapur)`}
            </span>
            
            <span className="hidden sm:block text-emerald-800/30 font-light text-xl leading-none -mt-0.5">|</span>
            <span className="sm:hidden w-1 h-1 rounded-full bg-emerald-800/30"></span>
            
            <div className="flex items-center gap-2 text-emerald-950 bg-white px-3 py-1.5 rounded-full shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-emerald-100/80">
              <MapPin size={12} className="text-teal-600 shrink-0" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {isMarathi ? "चंद्रपूर, महाराष्ट्र" : "Chandrapur, Maharashtra"}
              </span>
            </div>
            
            <span className="hidden sm:block text-emerald-800/30 font-light text-xl leading-none -mt-0.5">|</span>
            <span className="sm:hidden w-1 h-1 rounded-full bg-emerald-800/30"></span>
            
            <div className="flex items-center gap-2 px-1">
              <span className="text-emerald-800 font-serif font-semibold italic text-sm sm:text-base opacity-90">
                {isMarathi ? `स्थापना: ${MANDAL_REGISTRATION.est}` : `Est. ${MANDAL_REGISTRATION.est}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavLink = ({
  href,
  children,
  mobile = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={href}
    onClick={onClick}
    className={`${
      mobile
        ? "block px-4 py-4 text-base border-b border-white/5 hover:bg-white/5 hover:text-amber-400"
        : "px-6 py-5 text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-white/5 hover:text-amber-400 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
    } text-white transition-all duration-300`}
  >
    {children}
  </Link>
);

const DropdownMenu = ({
  title,
  items,
  mobile = false,
  onItemClick,
}: {
  title: string;
  items: { label: string; href: string }[];
  mobile?: boolean;
  onItemClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (mobile) {
    return (
      <div className="border-b border-white/5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left px-4 py-4 text-base text-white hover:bg-white/5 hover:text-amber-400 flex justify-between items-center transition-all duration-300"
        >
          {title}
          <ChevronDown
            size={16}
            className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-emerald-900/30"
            >
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.href}
                  onClick={onItemClick}
                  className="block px-8 py-3 text-sm text-slate-300 hover:text-amber-400 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className={`px-4 lg:px-6 py-5 text-[13px] font-bold uppercase tracking-[0.12em] hover:bg-white/5 hover:text-amber-400 transition-all duration-300 flex items-center gap-1.5 h-full relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-400 ${items.some(i => i.href === location.pathname) ? 'text-amber-400 after:scale-x-100' : 'text-white after:scale-x-0'} group-hover:after:scale-x-100 after:transition-transform after:origin-left`}>
        {title}{" "}
        <ChevronDown
          size={14}
          className="group-hover:rotate-180 transition-transform duration-300 shrink-0"
        />
      </button>
      <div className="absolute left-0 top-full w-80 md:w-96 max-h-[75vh] overflow-y-auto bg-emerald-950 border-t-2 border-amber-400 shadow-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 scrollbar-thin scrollbar-thumb-emerald-800 scrollbar-track-emerald-950">
        {items.map((item, idx) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={idx}
              to={item.href}
              onClick={onItemClick}
              className={`block px-5 py-3 text-[13px] font-semibold tracking-wide hover:bg-emerald-900 hover:text-amber-400 border-b border-white/5 last:border-0 transition-colors ${isActive ? 'text-amber-400 bg-emerald-900/50 font-bold' : 'text-slate-200'}`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function SingleInstitutionPage({ instId, institutions, content }: { instId: string, institutions: any[], content: Record<string, string> }) {
  return <InstitutionDetailView instId={instId} institutions={institutions} content={content} />;
}

export default function App() {

  const INSTITUTION_ENGLISH_NAMES: Record<string, string> = {
    "सरदार पटेल महाविद्यालय, चंद्रपूर": "Sardar Patel Mahavidyalaya, Chandrapur",
    "एस. आर. एम. महाविद्यालय सोशल वर्क पडोली चंद्रपूर": "S. R. M. College of Social Work, Padoli, Chandrapur",
    "शांताबाई पोटदुखे विधी महाविद्यालय, चंद्रपूर": "Shantabai Potdukhe College of Law, Chandrapur",
    "शंकरराव बेझलवार कला वाणिज्य महाविद्यालय, अहेरी": "Shankarrao Bezalwar Arts & Commerce College, Aheri",
    "सौ. लिना किशोर मामीडवार इन्स्टिट्यूट ऑफ मॅनेजमेंट स्टडीज ॲण्ड रिसर्च कोसारा चंद्रपूर": "Sau. Leena Kishore Mamidwar Institute of Management Studies & Research (DMSR), Kosara, Chandrapur",
    "राजीव गांधी कॉलेज ऑफ इंजिनिअरिंग, रिसर्च अँड टेक्नॉलॉजी, चंद्रपूर": "Rajiv Gandhi College of Engineering, Research & Technology (RCERT), Chandrapur",
    "एफ. ई. एस. गर्ल्स हायस्कूल व कनिष्ठ महाविद्यालय, चंद्रपूर": "F.E.S. Girls' High School & Junior College, Chandrapur",
    "सर्वोदय कन्या विद्यालय, सिंदेवाही": "Sarvodaya Kanya Vidyalaya, Sindewahi",
    "सर्वोदय विद्यालय व कनिष्ठ महाविद्यालय, बोथली": "Sarvodaya Vidyalaya & Junior College, Bothli",
    "सर्वोदय उच्च माध्यमिक व अध्यापक विद्यालय (D.El.Ed), चंद्रपूर": "Sarvodaya Higher Secondary & Junior College of Education (D.El.Ed), Chandrapur",
    "शांताबाई पोटदुखे इंग्लिश मीडियम स्कूल, चंद्रपूर": "Shantabai Potdukhe English Medium School, Chandrapur",
    "नेहरू विद्यालय व विज्ञान कनिष्ठ महाविद्यालय, चंद्रपूर": "Nehru Vidyalaya & Science Junior College, Chandrapur",
    "आदर्श किसान विद्यालय व कनिष्ठ महाविद्यालय, नारंडा, ता. कोरपना, जि. चंद्रपूर": "Adarsh Kisan Vidyalaya & Junior College, Naranda",
    "श्री साईनाथ विद्यालय, कढोली, ता. राजुरा, जि. चंद्रपूर": "Shri Sainath Vidyalaya, Kadholi",
    "सरस्वती विद्यालय व कनिष्ठ महाविद्यालय, वाढोली, ता. गोंडपिंपरी, जि. चंद्रपूर": "Saraswati Vidyalaya & Junior College, Wadholi",
    "गुरुनानक विद्यालय, विरूर (स्टे.), ता. राजुरा, जि. चंद्रपूर": "Gurunanak Vidyalaya, Virur (Stn)",
    "इंदिरा विद्यालय व कनिष्ठ महाविद्यालय, वरुड (रोड), ता. राजुरा, जि. चंद्रपूर": "Indira Vidyalaya & Junior College, Warur (Road)"
  };

  const getInstitutionLabel = (inst: any, isMarathi: boolean) => {
    const defInst = MANDAL_INSTITUTIONS.find(
      (i) =>
        String(i.id) === String(inst.id) ||
        i.nameMarathi === inst.name ||
        i.nameEnglish === inst.name ||
        i.nameMarathi === inst.nameMarathi ||
        i.nameEnglish === inst.nameEnglish
    );
    if (isMarathi) {
      return defInst?.nameMarathi || inst.nameMarathi || inst.name;
    }
    const eng = defInst?.nameEnglish || inst.nameEnglish || INSTITUTION_ENGLISH_NAMES[inst.name] || INSTITUTION_ENGLISH_NAMES[inst.nameMarathi];
    if (eng) return eng;
    if (inst.name && !/[\u0900-\u097F]/.test(inst.name)) return inst.name;
    return `Institution ${inst.id || ''}`;
  };

  // Compute designation counts to append -1, -2 for duplicates, strictly in English when English is selected
  const getBoardMemberNavLabel = (member: any, allMembers: any[], isMarathi: boolean) => {
    if (isMarathi) {
      const desg = member.designationMarathi || member.designation || member.designationEnglish || "पदाधिकारी";
      const sameDesgMembers = allMembers.filter(m => (m.designationMarathi || m.designation || '').includes("उपाध्यक्ष") && desg.includes("उपाध्यक्ष"));
      let label = desg;
      if (sameDesgMembers.length > 1 && desg.includes("उपाध्यक्ष")) {
        const index = sameDesgMembers.findIndex(m => m.srNo === member.srNo) + 1;
        label = `${label} - ${index}`;
      }
      return `${label} मनोगत`;
    }

    // English mode - strictly English only (NO Marathi words or suffixes)
    let desg = member.designationEnglish;
    if (!desg || /[\u0900-\u097F]/.test(desg)) {
      const dm = (member.designationMarathi || member.designation || '').trim();
      if (dm.includes("कार्यकारी अध्यक्ष") || dm.includes("कार्याध्यक्ष")) desg = "Executive President";
      else if (dm.includes("उपाध्यक्ष") || dm.includes("उपाध्यक्षा")) desg = "Vice President";
      else if (dm.includes("सहसचिव")) desg = "Joint Secretary";
      else if (dm.includes("सचिव")) desg = "Secretary";
      else if (dm.includes("कोषाध्यक्ष")) desg = "Treasurer";
      else if (dm.includes("अध्यक्ष")) desg = "President";
      else if (dm.includes("संचालक") || dm.includes("संचालिका")) desg = "Director";
      else if (dm.includes("सदस्य") || dm.includes("सदस्या")) desg = "Member";
      else desg = member.nameEnglish || "Executive Member";
    }

    const sameDesgMembers = allMembers.filter(m => {
      const otherDesg = m.designationEnglish || "";
      const otherDm = m.designationMarathi || m.designation || "";
      return otherDesg.toLowerCase() === desg.toLowerCase() || 
             (desg === "Vice President" && (otherDm.includes("उपाध्यक्ष") || otherDesg.toLowerCase().includes("vice president")));
    });

    let label = desg;
    if (sameDesgMembers.length > 1) {
      const index = sameDesgMembers.findIndex(m => m.srNo === member.srNo) + 1;
      label = `${label} - ${index}`;
    }
    return `${label} Message`;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [content, setContent] = useState<Record<string, string>>({});
  const [careers, setCareers] = useState<any[]>([]);
  const [advertisement, setAdvertisement] = useState<any>(null);
  const [applyingTo, setApplyingTo] = useState<any | null>(null);
  const [previewLightboxImage, setPreviewLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvertisementPdf().then(setAdvertisement).catch(console.error);
  }, []);
  const location = useLocation();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (location.pathname === "/" && location.hash === hash) {
      e.preventDefault();
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        const navHeight = 80;
        const y = element.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };
  const navigate = useNavigate();
  const path = location.pathname;

  const isHomePage = path === "/" || path === "/#home";
  const isMessageRoute = path.startsWith("/message/");
  const messageIdMatch = path.match(/^\/message\/(\d+)$/);
  const messageId = messageIdMatch ? parseInt(messageIdMatch[1]) : null;

  const isPresident = path === "/president-message";
  const isSecretary = path === "/secretary-message";
  const isWorkingPresident = path === "/working-president-message";
  const isVicePresident = path === "/vice-president-message";
  const isTreasurer = path === "/treasurer-message";
  const isJointSecretary = path === "/joint-secretary-message";
  const isLeadershipMessages = path === "/leadership-messages";
  const isAdminStaff = path === "/admin-staff";
  const isHistory = path === "/history-heritage";
  const isVision = path === "/vision-mission";
  const isManagement = path === "/management";
  const isInstitutions = path === "/institutions";
  const isNews = path === "/news";
  const isEvents = path === "/events";
  const isGallery = path === "/gallery";
  const isCareers = path === "/careers";
  const isApplyRoute = path === "/apply" || path === "/careers/apply";
  const isAlumni = path === "/alumni";
  const isContact = path === "/contact";
  const institutionMatch = path.match(/^\/institution\/(.+)$/);
  const singleInstId = institutionMatch ? institutionMatch[1] : null;

  // A helper to determine if we should show a section.
  // It shows if we are explicitly on its page, OR if we are on the homepage.
  // Wait, if the user wants separate pages, do they still want them on the homepage?
  // Let's assume the homepage keeps everything (as a one-page layout overview)
  // but clicking a submenu goes to an isolated page.
  // Actually, if we use separate pages, the isolated page only shows that section.

  const showHistory = isHomePage || isHistory;
  const showVision = isHomePage || isVision;
  const showManagement = isHomePage || isManagement;
  const showInstitutions = isHomePage || isInstitutions;
  const showNews = isHomePage || isNews;
  const showEvents = isHomePage || isEvents;
  const showGallery = isHomePage || isGallery;
  const showCareers = isHomePage || isCareers;
  const showContact = isHomePage || isContact;

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const navHeight = 80;
          const y = element.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 10);
      }
    } else if (!isHomePage) {
      setTimeout(() => {
        const navElement = document.querySelector('nav');
        if (navElement) {
          window.scrollTo(0, navElement.offsetTop);
        } else {
          window.scrollTo(0, 0);
        }
      }, 10);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, isHomePage]);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactSending, setContactSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    setContactSuccess("");
    try {
      await submitInquiry(contactForm);
      setContactSuccess("Thank you! Your message has been received. Our administrative team will reach out to you shortly.");
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setContactSending(false);
    }
  };

  const [events, setEvents] = useState<any[]>([
    {
      date: "Oct 15 2024",
      title: "National Science Seminar",
      desc: "Annual gathering of researchers and students featuring keynote speakers.",
    },
    {
      date: "Nov 02 2024",
      title: "Inter-College Sports Meet",
      desc: "Three-day athletic competition across track, field, and indoor sports.",
    },
    {
      date: "Dec 10 2024",
      title: "Alumni Association Gala",
      desc: "Networking and celebration evening for distinguished alumni.",
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchAnnouncements().then(setAnnouncements).catch(console.error);
    fetchEvents().then(setEvents).catch(console.error);
    fetchInstitutions().then(setInstitutions).catch(console.error);
    fetchContentBlocks().then(setContent).catch(console.error);
    fetchCareers().then(setCareers).catch(console.error);
  }, []);

  const { language, isMarathi, t } = useLanguage();

  let boardMembers: any[] = [];
  if (content['Custom_BoardOfDirectors']) {
    try {
      boardMembers = JSON.parse(content['Custom_BoardOfDirectors']);
    } catch(e) {}
  }
  if (boardMembers.length === 0) {
    boardMembers = EXECUTIVE_COMMITTEE.filter(m => m.srNo <= 7);
  }

  // Navigation Menu Titles strictly respecting language
  const navAboutTitle = isMarathi
    ? (content["Nav_About_Mr"] || (content["Nav_About"] && !/[\u0028(]About[\u0029)]/.test(content["Nav_About"]) ? content["Nav_About"] : "") || t("nav.about", "संस्थेविषयी", "About Mandal"))
    : (content["Nav_About_En"] || (content["Nav_About"] && !/[\u0900-\u097F]/.test(content["Nav_About"]) ? content["Nav_About"] : "") || t("nav.about", "संस्थेविषयी", "About Mandal"));

  const navInstitutionsTitle = isMarathi
    ? (content["Nav_Institutions_Mr"] || (content["Nav_Institutions"] && !/[\u0028(]Institutions[\u0029)]/.test(content["Nav_Institutions"]) ? content["Nav_Institutions"] : "") || t("nav.institutions", "आमच्या शिक्षण संस्था", "Our Institutions"))
    : (content["Nav_Institutions_En"] || (content["Nav_Institutions"] && !/[\u0900-\u097F]/.test(content["Nav_Institutions"]) ? content["Nav_Institutions"] : "") || t("nav.institutions", "आमच्या शिक्षण संस्था", "Our Institutions"));

  const navMediaTitle = isMarathi
    ? (content["Nav_Media_Mr"] || (content["Nav_Media"] && !/[\u0028(]Updates[\u0029)]/.test(content["Nav_Media"]) ? content["Nav_Media"] : "") || t("nav.media", "वृत्त व घडामोडी", "Media & Updates"))
    : (content["Nav_Media_En"] || (content["Nav_Media"] && !/[\u0900-\u097F]/.test(content["Nav_Media"]) ? content["Nav_Media"] : "") || t("nav.media", "वृत्त व घडामोडी", "Media & Updates"));

  const navCareersTitle = isMarathi
    ? (content["Nav_Careers_Mr"] || (content["Nav_Careers"] && !/[\u0028(]Careers[\u0029)]/.test(content["Nav_Careers"]) ? content["Nav_Careers"] : "") || t("nav.careers", "नोकरीच्या संधी", "Careers"))
    : (content["Nav_Careers_En"] || (content["Nav_Careers"] && !/[\u0900-\u097F]/.test(content["Nav_Careers"]) ? content["Nav_Careers"] : "") || t("nav.careers", "नोकरीच्या संधी", "Careers"));

  const navAlumniTitle = isMarathi
    ? (content["Nav_Alumni_Mr"] || (content["Nav_Alumni"] && !/[\u0028(]Alumni[\u0029)]/.test(content["Nav_Alumni"]) ? content["Nav_Alumni"] : "") || t("top.alumni", "माजी विद्यार्थी", "Alumni"))
    : (content["Nav_Alumni_En"] || (content["Nav_Alumni"] && !/[\u0900-\u097F]/.test(content["Nav_Alumni"]) ? content["Nav_Alumni"] : "") || t("top.alumni", "माजी विद्यार्थी", "Alumni"));

  const aboutMenuItems = [
    { label: t("nav.history", "इतिहास आणि वारसा", "History & Heritage"), href: "/history-heritage" },
    { label: t("nav.vision", "ध्येय आणि उद्दिष्टे", "Vision & Mission"), href: "/vision-mission" },
    { label: t("nav.management", "नियामक मंडळ (कार्यकारिणी)", "Board of Directors"), href: "/management" },
    ...boardMembers.map((member) => ({
      label: getBoardMemberNavLabel(member, boardMembers, isMarathi),
      href: "/message/" + member.srNo,
    })),
    { label: t("nav.allLeadership", "सर्व पदाधिकारी मनोगत", "All Leadership Messages"), href: "/leadership-messages" },
    {
      label: t("nav.adminStaff", "प्रशासकीय कार्यालय व कर्मचारी", "Administrative Office & Staff"),
      href: "/admin-staff",
    },
  ];

  const institutionMenuItems = [
    {
      label: t("nav.allInstitutions", "सर्व शैक्षणिक संस्था व निर्देशिका (११ संस्था)", "All Institutions & Directory (11 Institutions)"),
      href: "/institutions",
    },
    ...(institutions.length > 0 ? institutions : MANDAL_INSTITUTIONS).map((inst) => ({
      label: getInstitutionLabel(inst, isMarathi),
      href: `/institution/${inst.id}`,
    })),
  ];

  const mediaMenuItems = [
    { label: t("nav.news", "बातम्या व सूचना", "News & Announcements"), href: "/news" },
    { label: t("nav.events", "आगामी कार्यक्रम", "Upcoming Events"), href: "/events" },
    { label: t("nav.gallery", "छायाचित्र दालन", "Photo Gallery"), href: "/gallery" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-emerald-900 selection:bg-emerald-900 selection:text-white">
      <TopBar content={content} />
      <Header content={content} />

      {/* Main Navigation Bar */}
      <nav
        className={`bg-emerald-950 sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-2xl shadow-emerald-900/20 py-0" : "py-0 border-y border-white/10"}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center md:block h-16 md:h-auto">
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center justify-center">
              <NavLink href="/">{t("nav.home", "मुख्य पृष्ठ", "Home")}</NavLink>
              <DropdownMenu
                title={navAboutTitle}
                items={aboutMenuItems}
              />
              <DropdownMenu
                title={navInstitutionsTitle}
                items={institutionMenuItems}
              />
              <DropdownMenu
                title={navMediaTitle}
                items={mediaMenuItems}
              />
              <NavLink href="/careers">
                {navCareersTitle}
              </NavLink>
              <NavLink href="/alumni">
                {navAlumniTitle}
              </NavLink>
              <NavLink href="/contact">{t("nav.contact", "संपर्क", "Contact")}</NavLink>
            </div>

            {/* Mobile Menu Toggle Bar with quick language switch */}
            <div className="flex items-center md:hidden w-full justify-between py-2">
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="compact" />
                <span className="text-amber-400 font-bold uppercase tracking-widest text-xs ml-2">
                  {t("nav.menu", "मेनू", "Menu")}
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 bg-emerald-950"
            >
              <div className="flex flex-col pb-4">
                {/* Mobile Language Switcher inside menu */}
                <div className="px-4 py-3 bg-black/30 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                    {t("top.langLabel", "भाषा निवडा", "Language")}:
                  </span>
                  <LanguageSwitcher variant="topbar" />
                </div>

                <NavLink
                  href="/"
                  mobile
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.home", "मुख्य पृष्ठ", "Home")}
                </NavLink>
                <DropdownMenu
                  mobile
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  title={navAboutTitle}
                  items={aboutMenuItems}
                />
                <DropdownMenu
                  mobile
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  title={navInstitutionsTitle}
                  items={institutionMenuItems}
                />
                <DropdownMenu
                  mobile
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  title={navMediaTitle}
                  items={mediaMenuItems}
                />
                <NavLink
                  href="/careers"
                  mobile
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navCareersTitle}
                </NavLink>
                <NavLink
                  href="/alumni"
                  mobile
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {navAlumniTitle}
                </NavLink>
                <NavLink
                  href="/contact"
                  mobile
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.contact", "संपर्क", "Contact")}
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 flex flex-col">
        {/* Floating Action Button */}
        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 z-50 bg-amber-500 hover:bg-amber-400 text-emerald-950 p-3 rounded-full shadow-2xl transition-colors border border-amber-300 group"
            >
              <ArrowUp
                size={24}
                className="group-hover:-translate-y-1 transition-transform"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notice Board Ticker */}
        <div className="bg-white border-b border-slate-200 overflow-hidden flex items-center relative z-40 shadow-sm">
          <div className="bg-emerald-900 text-white px-6 md:px-10 py-3.5 flex items-center gap-2 font-bold uppercase tracking-widest text-xs shrink-0 relative z-10">
            <Bell size={14} className="animate-pulse text-amber-400" />
            <span className="hidden md:inline">{t("announcements.latest", "नवीन", "Latest")}</span> {t("announcements.updates", "घडामोडी", "Updates")}
          </div>
          <div className="flex-1 overflow-hidden relative whitespace-nowrap py-3.5 flex items-center">
            <div className="animate-[marquee_25s_linear_infinite] inline-block text-slate-700 text-sm font-medium tracking-wide">
              {announcements.length > 0 ? (
                announcements.map((ann, idx) => {
                  const hasAttachment = Boolean(ann.attachmentUrl);
                  const isPdf = ann.attachmentType === 'pdf' || (ann.attachmentUrl && ann.attachmentUrl.toLowerCase().endsWith('.pdf'));

                  return (
                    <React.Fragment key={idx}>
                      <span className="mx-6 inline-flex items-center gap-2">
                        {ann.isNew && (
                          <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider">
                            NEW
                          </span>
                        )}
                        <span>
                          {ann.title && ann.content && ann.title !== ann.content
                            ? `${ann.title}: ${ann.content}`
                            : ann.title || ann.content || ann.text}
                        </span>
                        {hasAttachment && (
                          <a
                            href={getDownloadUrl(ann.attachmentUrl, ann.attachmentOriginalName)}
                            download={ann.attachmentOriginalName || (isPdf ? "Official_Notice.pdf" : "Official_Notice.jpg")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 hover:text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs transition-colors"
                            title={isMarathi ? "परिपत्रक डाउनलोड करा" : "Download Attached Circular"}
                          >
                            <Download size={11} />
                            <span>{isPdf ? "PDF" : "JPG"}</span>
                          </a>
                        )}
                      </span>
                      <span className="mx-2 text-emerald-300">•</span>
                    </React.Fragment>
                  );
                })
              ) : (
                <>
                  <span className="mx-6">
                    {t(
                      "ticker.item1",
                      "शैक्षणिक वर्ष २०२४-२५ करीता पदवी व पदव्युत्तर प्रवेश प्रक्रिया सुरू आहे.",
                      "Admissions for Degree and Post-Graduate courses are now open."
                    )}
                  </span>
                  <span className="mx-2 text-emerald-300">•</span>
                  <span className="mx-6">
                    {t(
                      "ticker.item2",
                      "सरदार पटेल महाविद्यालय, चंद्रपूर: नॅक (NAAC) पुनर्मूल्यांकन यशस्वीरीत्या संपन्न.",
                      "Sardar Patel Mahavidyalaya, Chandrapur: NAAC Re-accreditation successfully concluded."
                    )}
                  </span>
                  <span className="mx-2 text-emerald-300">•</span>
                  <span className="mx-6">
                    {t(
                      "ticker.item3",
                      "कॅम्पस प्लेसमेंट ड्राइव्ह २०२४ चे आयोजन लवकरच करण्यात येत आहे.",
                      "Campus Placement Drive 2024 scheduled for leading industrial houses."
                    )}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hero Section */}
        {isHomePage && (
          <section
            id="home"
            className="relative py-6 md:py-8 overflow-hidden bg-emerald-950"
          >
            <div className="absolute inset-0">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
                src={
                  content["Hero_Background_Image"] ||
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"
                }
                alt="College Campus"
                className="w-full h-full object-cover opacity-60"
              />
              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-transparent to-transparent" />
            </div>

            <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-amber-500"></div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
                    {content[isMarathi ? "Hero_PreTitle_Mr" : "Hero_PreTitle"] ||
                      t("hero.preTitle", "स्थापना १९८३ • ११+ नामांकित शैक्षणिक संस्थांचे संचलन", "Established 1983 • Managing 11+ Institutions")}
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-[1.1]">
                  {content[isMarathi ? "Hero_Title_Mr" : "Hero_Title"] ||
                    t("hero.title", "मूल्याधिष्ठित शिक्षणातून सामर्थ्यशाली पिढीची निर्मिती.", "Empowering Education From Roots To Wings.")}
                </h2>
                <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl font-light text-justify">
                  {content[isMarathi ? "Hero_Desc_Mr" : "Hero_Description"] ||
                    t("hero.desc", "सर्वोदय शिक्षण मंडळ ही मध्य भारतातील एक अग्रगण्य शिक्षण संस्था असून ती शाळा, कनिष्ठ महाविद्यालये, पदवी व पदव्युत्तर अभ्यासक्रम चालविणाऱ्या ११ नामांकित संस्थांचे यशस्वी संचालन करत आहे.", "Sarvodaya Shikshan Mandal is a premier educational trust managing a diverse network of schools, degree colleges, and post-graduate institutes across the region.")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/#institutions"
                    onClick={(e) => handleHashClick(e, '#institutions')}
                    className="bg-emerald-900 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors flex items-center gap-2 rounded-sm group"
                  >
                    {t("hero.exploreInstitutions", "आमच्या संस्था", "Our Institutions")}{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm"
                  >
                    {t("hero.contactAdmissions", "प्रवेश संपर्क", "Contact Admissions")}
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Impact By The Numbers */}
        {isHomePage && (
          <section className="bg-emerald-900 border-y border-emerald-800 relative z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x-0 md:divide-x divide-emerald-800/50 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                    {content["Stat1_Value"] || "40"}
                    <span className="text-emerald-500">+</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    {content[isMarathi ? "Stat1_Label_Mr" : "Stat1_Label"] || t("stats.legacy", "वर्षांचा वारसा", "Years of Legacy")}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                    {content["Stat2_Value"] || "11"}
                    <span className="text-emerald-500">+</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    {content[isMarathi ? "Stat2_Label_Mr" : "Stat2_Label"] || t("stats.institutions", "शैक्षणिक संस्था", "Institutions")}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                    {content["Stat3_Value"] || "150"}
                    <span className="text-emerald-500">+</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    {content[isMarathi ? "Stat3_Label_Mr" : "Stat3_Label"] || t("stats.faculty", "तज्ज्ञ प्राध्यापक व शिक्षक", "Expert Faculty")}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-4xl md:text-5xl font-serif text-amber-400 mb-2">
                    {content["Stat4_Value"] || "40k"}
                    <span className="text-emerald-500">+</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
                    {content[isMarathi ? "Stat4_Label_Mr" : "Stat4_Label"] || t("stats.alumni", "यशस्वी माजी विद्यार्थी", "Global Alumni")}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {showHistory && (
          <section id="about" className="py-8 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid lg:grid-cols-2 gap-4 md:gap-24 items-center mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                      {isMarathi ? "आमचा वारसा" : "Our Heritage"}
                    </span>
                    <div className="w-16 h-px bg-slate-200"></div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 mb-8 leading-tight">
                    {content[isMarathi ? "About_Title_Mr" : "About_Title"] ||
                      (isMarathi
                        ? "चार दशकांहून अधिक काळाचा शैक्षणिक उत्कृष्टतेचा वारसा."
                        : "Managing educational excellence for over four decades.")}
                  </h2>
                  <div className="prose prose-lg text-slate-600 mb-10 text-justify">
                    <p className="leading-relaxed whitespace-pre-wrap text-justify">
                      {content[isMarathi ? "About_Paragraph_Mr" : "About_Paragraph"] ||
                        (isMarathi
                          ? `१९८३ मध्ये स्थापन झालेले सर्वोदय शिक्षण मंडळ, चंद्रपूर ही या भागातील शैक्षणिक विकासाचा एक भक्कम आधारस्तंभ आहे. सर्वांसाठी दर्जेदार व सुलभ शिक्षण उपलब्ध करून देण्याच्या ध्येयाने सुरू झालेली ही संस्था आज ११ नामांकित संस्थांचे एक विशाल संकुल बनली आहे.\n\nआमचे अग्रगण्य सरदार पटेल महाविद्यालय हे विद्यार्थ्यांच्या सर्वांगीण विकासाचे मूर्तिमंत उदाहरण असून, ते कठोर शैक्षणिक निकषांची नैतिक व सांस्कृतिक मूल्यांशी यशस्वी सांगड घालते.`
                          : `Founded in 1983, Sarvodaya Shikshan Mandal has been a pillar of educational development in Chandrapur. What began as a singular vision to provide accessible, high-quality education has grown into a vast network of premier institutions.\n\nOur flagship college, Sardar Patel Mahavidyalaya, stands as a testament to our commitment to holistic student development, successfully blending rigorous academic standards with strong moral and cultural values.`)}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                    <div className="group">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 mb-4 group-hover:border-emerald-900 group-hover:bg-emerald-50 transition-colors">
                        <Users className="text-emerald-900" size={20} />
                      </div>
                      <h4 className="font-bold text-emerald-900 mb-2 font-serif text-xl">
                        {isMarathi ? "तज्ज्ञ प्राध्यापक" : "Expert Faculty"}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed text-justify">
                        {isMarathi
                          ? "पुढील पिढीला घडवणारे समर्पित शिक्षक व अनुभवी मार्गदर्शक."
                          : "Dedicated educators and industry veterans guiding the next generation."}
                      </p>
                    </div>
                    <div className="group">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 mb-4 group-hover:border-emerald-900 group-hover:bg-emerald-50 transition-colors">
                        <Building className="text-emerald-900" size={20} />
                      </div>
                      <h4 className="font-bold text-emerald-900 mb-2 font-serif text-xl">
                        {isMarathi ? "आधुनिक कॅम्पस" : "Modern Campus"}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed text-justify">
                        {isMarathi
                          ? "अद्ययावत प्रयोगशाळा, समृद्ध ग्रंथालये व प्रगत संशोधन सुविधा."
                          : "State-of-the-art laboratories, libraries, and research facilities."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-[600px]">
                  <div className="absolute inset-0 bg-slate-100 translate-x-4 translate-y-4 rounded-sm"></div>
                  <ImageWithFallback
                    src={
                      content["About_Image"] ||
                      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
                    }
                    alt="Students on Campus"
                    className="relative z-10 w-full h-full object-cover rounded-sm"
                  />
                  <div className="absolute -bottom-8 -left-8 z-20 bg-emerald-900 text-white p-8 shadow-2xl border border-emerald-800 rounded-sm">
                    <div className="text-5xl font-serif mb-2">
                      40<span className="text-amber-400">+</span>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 leading-relaxed">
                      {isMarathi ? (
                        <>
                          वर्षांची
                          <br />
                          उत्कृष्टता
                        </>
                      ) : (
                        <>
                          Years of
                          <br />
                          Excellence
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Founder Section (Inside History & Heritage) */}
        {showHistory && (
          <section className="relative py-24 md:py-32 bg-emerald-950 overflow-hidden border-y-[12px] border-emerald-900 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 bg-black/20 z-0"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-amber-600/20 via-transparent to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none z-0"></div>
            
            {/* Ambient pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0 mix-blend-overlay"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
              
              {/* Section Header */}
              <div className="text-center mb-16 md:mb-24 relative">
                <div className="inline-flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-400 font-bold uppercase tracking-[0.3em] text-xs sm:text-sm drop-shadow-md">
                    {isMarathi ? "आमचे प्रेरणास्थान" : "Our Source of Inspiration"}
                  </span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 font-black tracking-tight leading-tight drop-shadow-2xl">
                  {isMarathi ? "स्व. शांतारामजी पोटदुखे" : "Late Shantaram Potdukhe"}
                </h2>
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-950/40 backdrop-blur-sm">
                  <Award size={16} className="text-amber-400" />
                  <p className="text-amber-200 font-bold tracking-widest uppercase text-xs md:text-sm">
                    {isMarathi ? "माजी केंद्रीय वित्त राज्यमंत्री" : "Former Union Minister of State for Finance"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
                
                {/* Photo Column - Monumental Memorial Framing */}
                <div className="w-full lg:w-5/12 shrink-0 flex justify-center">
                  <div className="relative group mt-8 md:mt-0">
                    {/* Golden Glow Behind */}
                    <div className="absolute -inset-10 bg-amber-500/20 rounded-full blur-[60px] opacity-70"></div>
                    
                    {/* Decorative Premium Frame - Rectangular Memorial Style */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-amber-950 via-amber-800 to-amber-950 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:rotate-1"></div>
                    <div className="absolute -inset-2 bg-gradient-to-tr from-amber-300 via-yellow-600 to-amber-800 rounded-md z-10 pointer-events-none border border-yellow-200/50"></div>
                    
                    <div className="relative p-2 bg-black rounded-sm shadow-inner transition-transform duration-500 group-hover:-translate-y-2 z-20">
                      
                      <ImageWithFallback 
                        src={content["Founder_Image"] || "/images/shantaram_potdukhe.jpg"} 
                        alt="Late Shantaram Potdukhe" 
                        className="relative z-10 w-[280px] sm:w-[340px] lg:w-[380px] h-[380px] sm:h-[450px] lg:h-[500px] object-cover rounded-sm contrast-[1.1] saturate-[0.85] sepia-[15%] brightness-[1.05]"
                      />
                      
                      {/* Floating Tribute Label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 px-8 py-2.5 shadow-2xl border-2 border-amber-500/80 rounded-full flex items-center justify-center whitespace-nowrap">
                        <Heart size={14} className="text-amber-400 mr-2 fill-amber-400" />
                        <span className="text-amber-100 font-bold text-sm md:text-base tracking-widest font-serif drop-shadow-md">
                          {isMarathi ? "आमचे प्रेरणास्थान" : "Our Inspiration"}
                        </span>
                        <Heart size={14} className="text-amber-400 ml-2 fill-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Column - Refined Typography */}
                <div className="w-full lg:w-7/12">
                  <div className="relative bg-emerald-900/40 p-8 sm:p-10 md:p-12 rounded-3xl border border-emerald-800/60 backdrop-blur-xl shadow-2xl">
                    <Quote className="absolute top-8 left-8 text-amber-500/10 w-32 h-32 rotate-180 pointer-events-none" />
                    
                    <p className="relative z-10 text-emerald-50/90 text-lg sm:text-xl md:text-2xl leading-relaxed text-justify font-serif italic mb-10 drop-shadow-sm font-light">
                      {content[isMarathi ? "Founder_Bio_Mr" : "Founder_Bio_En"] || (isMarathi
                        ? "स्वर्गीय शांतारामजी पोटदुखे हे चंद्रपूर येथील सर्वोदय शिक्षण मंडळाचे (नोंदणी क्रमांक F-09 (C)) संस्थापक आणि दूरदर्शी नेते होते. संस्थापक आणि प्रदीर्घ काळ अध्यक्ष म्हणून कार्यभार सांभाळताना, त्यांनी या संस्थेला मध्य भारतातील एका अग्रगण्य शैक्षणिक नेटवर्कमध्ये रूपांतरित केले, आणि विदर्भाच्या शैक्षणिक क्षेत्रात संपूर्ण क्रांती घडवून आणली."
                        : "Late Shantaram Potdukhe (former Union Minister of State for Finance) was the foundational architect and visionary leader behind Sarvodaya Shikshan Mandal (SSM), Chandrapur (Trust Registration No. F-09 (C)). Serving as its longtime President and founder, he transformed this trust into Central India's premier educational network, completely revolutionizing the academic landscape of the Vidarbha.")}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-emerald-800/80 relative z-10">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-950 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner text-amber-400">
                          <Building size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold tracking-widest uppercase text-[11px] mb-1.5">
                            {isMarathi ? "संस्थापक आणि दूरदर्शी" : "Foundational Architect"}
                          </h4>
                          <p className="text-emerald-200/70 text-sm leading-relaxed">
                            {isMarathi ? "सर्वोदय शिक्षण मंडळ (नोंदणी क्रमांक F-09 (C))" : "Sarvodaya Shikshan Mandal (Trust Reg. No. F-09 (C))"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-950 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner text-amber-400">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold tracking-widest uppercase text-[11px] mb-1.5">
                            {isMarathi ? "शैक्षणिक क्रांती" : "Academic Revolution"}
                          </h4>
                          <p className="text-emerald-200/70 text-sm leading-relaxed">
                            {isMarathi ? "मध्य भारतातील अग्रगण्य शैक्षणिक नेटवर्कची स्थापना" : "Transformed the trust into Central India's premier network"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Vision & Mission */}
        {showVision && (
          <section className="py-8 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div
                id="vision-mission"
                className="grid md:grid-cols-2 gap-4 mb-8"
              >
                <div className="bg-emerald-950 text-white p-10 md:p-14 rounded-sm relative overflow-hidden shadow-xl border border-emerald-900">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target size={120} />
                  </div>
                  <h3 className="text-2xl font-serif mb-6 relative z-10 flex items-center gap-3">
                    {content[isMarathi ? "Vision_Title_Mr" : "Vision_Title"] ||
                      (isMarathi ? "आमचे ध्येय (Vision)" : "Our Vision")}
                  </h3>
                  <p className="text-emerald-100/90 leading-relaxed relative z-10 text-lg font-light whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Vision_Desc_Mr" : "Vision_Desc"] ||
                      (isMarathi
                        ? "शैक्षणिक उत्कृष्टता, नैतिक मूल्ये आणि सामाजिक बांधिलकी जोपासणाऱ्या अग्रगण्य शैक्षणिक संकुलाची निर्मिती करणे; ज्यामुळे विद्यार्थी आजच्या गतिमान जागतिक समाजात दूरदर्शी नेतृत्व म्हणून पुढे येतील."
                        : "To establish a premier educational network that fosters academic excellence, moral integrity, and social responsibility, empowering students to become visionary leaders in a dynamic global society.")}
                  </p>
                </div>
                <div className="bg-white border border-slate-200 p-10 md:p-14 rounded-sm relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-900">
                    <Compass size={120} />
                  </div>
                  <h3 className="text-2xl font-serif mb-6 text-emerald-950 relative z-10 flex items-center gap-3">
                    {content[isMarathi ? "Mission_Title_Mr" : "Mission_Title"] ||
                      (isMarathi ? "आमची उद्दिष्टे (Mission)" : "Our Mission")}
                  </h3>
                  <p className="text-slate-600 leading-relaxed relative z-10 text-lg font-light whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Mission_Desc_Mr" : "Mission_Desc"] ||
                      (isMarathi
                        ? "आधुनिक अध्यापन पद्धती व अद्ययावत सुविधांद्वारे गुणवत्तापूर्ण व सुलभ शिक्षण उपलब्ध करून देणे; तसेच विद्यार्थ्यांमध्ये बौद्धिक जिज्ञासा, नैतिक मूल्ये व सर्वांगीण विकास घडवणारे पोषक वातावरण निर्माण करणे."
                        : "To provide accessible, high-quality education through modern pedagogy and state-of-the-art facilities, cultivating a learning environment that nurtures intellectual curiosity, ethical values, and holistic development.")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Management Details */}
        {showManagement && (
          <ExecutiveCommitteeSection content={content} />
        )}

        {/* Institutions Section (Premium Cards) */}

        {isMessageRoute && messageId && (
          <LeadershipMessages content={content} activeMemberId={messageId} />
        )}
        
        {isPresident && ( <LeadershipMessages content={content} activeMemberId={1} /> )}
        {isWorkingPresident && ( <LeadershipMessages content={content} activeMemberId={2} /> )}
        {isVicePresident && ( <LeadershipMessages content={content} activeMemberId={3} /> )}
        {isSecretary && ( <LeadershipMessages content={content} activeMemberId={5} /> )}
        {isJointSecretary && ( <LeadershipMessages content={content} activeMemberId={6} /> )}
        {isTreasurer && ( <LeadershipMessages content={content} activeMemberId={7} /> )}



        {isLeadershipMessages && (
          <LeadershipMessages content={content} activeLeader="all" />
        )}

        {isAdminStaff && (
          <section
            id="admin-staff"
            className="py-8 md:py-10 bg-emerald-950 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-px bg-amber-500"></div>
                  <span className="text-amber-400 font-bold uppercase tracking-[0.2em] text-xs">
                    {isMarathi ? "प्रशासकीय आधारस्तंभ" : "The Backbone"}
                  </span>
                  <div className="w-12 h-px bg-amber-500"></div>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
                  {content[isMarathi ? "AdminStaff_Section_Title_Mr" : "AdminStaff_Section_Title"] ||
                    (isMarathi ? "प्रशासकीय कार्यालय व साहाय्यक कर्मचारी" : "Administrative Office & Support Staff")}
                </h2>
                <p className="text-emerald-100/80 leading-relaxed text-lg text-justify">
                  {isMarathi
                    ? "आमच्या विशाल शैक्षणिक संकुलाचे दैनंदिन कामकाज सुरळीत, शिस्तबद्ध व पारदर्शक पद्धतीने चालविण्यामध्ये आमच्या प्रशासकीय अधिकारी व सेवक कर्मचाऱ्यांचा मोलाचा वाटा आहे."
                    : "The seamless functioning of our vast educational network is made possible by the dedicated efforts of our administrative professionals and support staff."}
                </p>
              </div>

              
              <div className="mb-12">
                {(() => {
                  const num = 1;
                  const name = content[isMarathi ? `AdminStaff_Profile${num}_Name_Mr` : `AdminStaff_Profile${num}_Name`] ||
                    (isMarathi ? "उत्तम गेडाम" : "Uttam Gedam");
                  const title = content[isMarathi ? `AdminStaff_Profile${num}_Title_Mr` : `AdminStaff_Profile${num}_Title`] ||
                    (isMarathi ? "प्रशासकीय अधिकारी" : "Administrative Officer");
                  const desc = content[isMarathi ? `AdminStaff_Profile${num}_Desc_Mr` : `AdminStaff_Profile${num}_Desc`] ||
                    (isMarathi
                      ? "सर्वोदय शिक्षण मंडळाच्या सर्व संस्थांमधील मध्यवर्ती प्रशासकीय कामकाज, नियमपालन आणि कार्यक्षम समन्वयाची जबाबदारी सांभाळत आहेत."
                      : "Overseeing central administrative operations, compliance, and seamless coordination across all institutions of Sarvodaya Shikshan Mandal.");
                  const img = content[`AdminStaff_Profile${num}_Image`] || "/images/Uttam_Gedam.jpeg";
                  const phone = content[`AdminStaff_Profile${num}_Phone`] || "";
                  const email = content[`AdminStaff_Profile${num}_Email`] || "";

                  if (!name && !title && !desc) return null;
                  
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white/5 border border-amber-500/30 p-8 md:p-12 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
                      <div className="w-48 h-64 md:w-72 md:h-96 shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/10 to-transparent z-10 opacity-60"></div>
                        {img ? (
                          <ImageWithFallback src={img} alt={name} className="w-full h-full object-cover bg-emerald-900 relative z-0 transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full bg-emerald-900/50 flex items-center justify-center">
                            <Users size={64} className="text-emerald-100/30" />
                          </div>
                        )}
                      </div>
                      <div className="text-center md:text-left flex-1 relative z-10">
                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">
                          {name}
                        </h3>
                        <div className="text-sm md:text-base uppercase tracking-widest font-bold text-amber-500 mb-6 inline-block bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                          {title}
                        </div>
                        <p className="text-emerald-100/90 text-base md:text-lg leading-relaxed whitespace-pre-wrap text-justify mb-6">
                          {desc}
                        </p>
                        {(phone || email) && (
                          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            {phone && (
                              <a href={`tel:${phone}`} className="flex items-center justify-center md:justify-start gap-2 text-emerald-100/80 hover:text-amber-400 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                <Phone size={16} />
                                <span>{phone}</span>
                              </a>
                            )}
                            {email && (
                              <a href={`mailto:${email}`} className="flex items-center justify-center md:justify-start gap-2 text-emerald-100/80 hover:text-amber-400 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                                <Mail size={16} />
                                <span>{email}</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    num: 2,
                    defaultName: isMarathi ? "हिशोब व वित्त विभाग" : "Accounts & Finance",
                    defaultTitle: isMarathi ? "आर्थिक नियोजन व व्यवस्थापन" : "Financial Planning",
                    defaultDesc: isMarathi
                      ? "पारदर्शकता व आर्थिक शिस्त राखत आमचा वित्त विभाग विद्यार्थ्यांच्या सोयी-सुविधा व पायाभूत विकासाचे व्यवस्थापन करतो."
                      : "Maintaining transparency and financial discipline, our accounts division ensures that student services and infrastructural developments are well-funded and efficiently managed.",
                    defaultImage: ""
                  },
                  {
                    num: 3,
                    defaultName: isMarathi ? "सेवक व साहाय्यक कर्मचारी" : "Support Staff",
                    defaultTitle: isMarathi ? "कॅम्पस सेवा व सुरक्षा" : "Campus Services",
                    defaultDesc: isMarathi
                      ? "कॅम्पस सुरक्षा, स्वच्छता, प्रयोगशाळा साहाय्य व ग्रंथालय सेवा पुरवून सर्वांसाठी सुरक्षित व स्वच्छ वातावरण राखणारे कर्मचारी."
                      : "From campus security and maintenance to laboratory assistants and library attendants, our support staff creates a safe, clean, and welcoming environment for everyone.",
                    defaultImage: ""
                  },
                  { num: 4, defaultName: "", defaultTitle: "", defaultDesc: "", defaultImage: "" },
                  { num: 5, defaultName: "", defaultTitle: "", defaultDesc: "", defaultImage: "" },
                  { num: 6, defaultName: "", defaultTitle: "", defaultDesc: "", defaultImage: "" },
                  { num: 7, defaultName: "", defaultTitle: "", defaultDesc: "", defaultImage: "" },
                  { num: 8, defaultName: "", defaultTitle: "", defaultDesc: "", defaultImage: "" }
                ].map(({num, defaultName, defaultTitle, defaultDesc, defaultImage}, i) => {
                  const name = content[isMarathi ? `AdminStaff_Profile${num}_Name_Mr` : `AdminStaff_Profile${num}_Name`] || defaultName;
                  const title = content[isMarathi ? `AdminStaff_Profile${num}_Title_Mr` : `AdminStaff_Profile${num}_Title`] || defaultTitle;
                  const desc = content[isMarathi ? `AdminStaff_Profile${num}_Desc_Mr` : `AdminStaff_Profile${num}_Desc`] || defaultDesc;
                  const img = content[`AdminStaff_Profile${num}_Image`] || defaultImage;
                  const phone = content[`AdminStaff_Profile${num}_Phone`] || "";
                  const email = content[`AdminStaff_Profile${num}_Email`] || "";

                  if (!name && !title && !desc) return null;
                  
                  return (
                    <motion.div
                      key={num}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1 }}
                      className="bg-emerald-900/20 border border-white/10 p-6 md:p-8 rounded-2xl backdrop-blur-sm hover:bg-emerald-900/40 transition-colors flex flex-col items-center text-center group relative overflow-hidden shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/80 pointer-events-none z-0"></div>
                      <div className="relative z-10 flex flex-col items-center w-full">
                        {img ? (
                           <div className="w-32 h-40 md:w-40 md:h-52 rounded-xl overflow-hidden mb-6 shadow-2xl border border-white/10 group-hover:border-amber-400/40 transition-colors relative">
                             <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent z-10 opacity-40 group-hover:opacity-20 transition-opacity duration-500"></div>
                             <ImageWithFallback src={img} alt={name} className="w-full h-full object-cover bg-emerald-950 group-hover:scale-110 transition-transform duration-700 relative z-0" />
                           </div>
                        ) : (
                           <div className="w-32 h-40 md:w-40 md:h-52 rounded-xl bg-emerald-950/80 flex items-center justify-center mb-6 shadow-2xl border border-white/10 group-hover:border-amber-400/40 transition-colors relative">
                             <Users size={40} className="text-emerald-100/20 group-hover:text-amber-400/60 transition-colors duration-500" />
                           </div>
                        )}
                      
                      {name && (
                        <h3 className="text-xl font-serif text-white mb-1">
                          {name}
                        </h3>
                      )}
                      {title && (
                        <div className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-4">
                          {title}
                        </div>
                      )}
                      {desc && (
                        <p className="text-emerald-100/70 text-sm leading-relaxed mb-6 whitespace-pre-wrap text-justify">
                          {desc}
                        </p>
                      )}
                      
                      {(phone || email) && (
                        <div className="flex flex-col gap-3 justify-center w-full mt-auto">
                          {phone && (
                            <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 text-emerald-100/80 hover:text-amber-400 transition-colors bg-black/20 px-3 py-2 rounded-lg border border-white/5 text-sm">
                              <Phone size={14} className="shrink-0" />
                              <span className="truncate">{phone}</span>
                            </a>
                          )}
                          {email && (
                            <a href={`mailto:${email}`} className="flex items-center justify-center gap-2 text-emerald-100/80 hover:text-amber-400 transition-colors bg-black/20 px-3 py-2 rounded-lg border border-white/5 text-sm">
                              <Mail size={14} className="shrink-0" />
                              <span className="truncate">{email}</span>
                            </a>
                          )}
                        </div>
                      )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {showInstitutions && (
          <InstitutionsSection content={content} institutions={institutions} />
        )}

        {/* Media & Updates Section */}
        {showNews && (
          <section id="media" className="py-8 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                  {isMarathi ? "बातम्या व माध्यम" : "News & Media"}
                </span>
                <div className="w-16 h-px bg-slate-300"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 leading-tight mb-8 md:mb-6">
                {content[isMarathi ? "Media_Title_Mr" : "Media_Title"] ||
                  (isMarathi ? "वृत्त व ताज्या घडामोडी" : "Media & Updates")}
              </h2>

              {/* News & Announcements */}
              <div id="news" className="mb-6">
                <div className="flex items-center gap-3 mb-8">
                  <Bell className="text-amber-500" size={24} />
                  <h3 className="text-2xl font-serif text-emerald-950">
                    {isMarathi ? "बातम्या व महत्त्वाच्या सूचना" : "News & Announcements"}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {announcements.length > 0 ? (
                    announcements.map((ann, idx) => {
                      const hasAttachment = Boolean(ann.attachmentUrl);
                      const isPdf = ann.attachmentType === 'pdf' || (ann.attachmentUrl && ann.attachmentUrl.toLowerCase().endsWith('.pdf'));
                      const isImage = ann.attachmentType === 'image' || (ann.attachmentUrl && /\.(jpe?g|png|webp|gif)$/i.test(ann.attachmentUrl));

                      return (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 p-6 rounded-lg hover:border-emerald-900/40 hover:shadow-md transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 group-hover:scale-125 transition-transform"></div>
                                {(ann.isNew || ann.is_new) && (
                                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                    {isMarathi ? "नवीन" : "NEW"}
                                  </span>
                                )}
                              </div>
                              {ann.date && (
                                <span className="text-[11px] text-slate-400 block font-medium shrink-0">
                                  {ann.date}
                                </span>
                              )}
                            </div>

                            {ann.title && (
                              <h4 className="font-bold text-emerald-950 text-base mb-1.5 group-hover:text-emerald-800 transition-colors">
                                {ann.title}
                              </h4>
                            )}
                            <p className="text-slate-700 leading-relaxed text-sm text-justify">
                              {ann.content || ann.text || ann.title}
                            </p>
                          </div>

                          {/* PDF or JPG Attachment Download Action */}
                          {hasAttachment && (
                            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isPdf ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                                  {isPdf ? <FileText size={18} /> : <ImageIcon size={18} />}
                                </div>
                                <div className="text-left">
                                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <span>{isPdf ? (isMarathi ? "अधिकृत परिपत्रक (PDF)" : "Official Circular (PDF)") : (isMarathi ? "अधिकृत जाहिरात / नोटीस (JPG)" : "Notice Image (JPG)")}</span>
                                  </div>
                                  {ann.attachmentOriginalName && (
                                    <p className="text-[11px] text-slate-500 truncate max-w-[190px]" title={ann.attachmentOriginalName}>
                                      {ann.attachmentOriginalName}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {isImage && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewLightboxImage(ann.attachmentUrl)}
                                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                                  >
                                    <Eye size={13} /> {isMarathi ? "पहा" : "View"}
                                  </button>
                                )}
                                <a
                                  href={getDownloadUrl(ann.attachmentUrl, ann.attachmentOriginalName)}
                                  download={ann.attachmentOriginalName || (isPdf ? "Notice_Circular.pdf" : "Notice_Circular.jpg")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                                >
                                  <Download size={13} />
                                  <span>{isPdf ? (isMarathi ? "डाउनलोड करा" : "Download PDF") : (isMarathi ? "डाउनलोड करा" : "Download Image")}</span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm hover:border-emerald-900/30 hover:shadow-md transition-all flex gap-4 items-start group">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <p className="text-slate-700 leading-relaxed text-sm text-justify">
                          {isMarathi
                            ? "एम.सी.ए. आणि एम.बी.ए. पदव्युत्तर अभ्यासक्रमांसाठी प्रवेश सुरू आहेत. १५ जुलैपूर्वी अर्ज करा."
                            : "Admissions for MCA and MBA are now open. Apply before July 15th."}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm hover:border-emerald-900/30 hover:shadow-md transition-all flex gap-4 items-start group">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <p className="text-slate-700 leading-relaxed text-sm text-justify">
                          {isMarathi
                            ? "नॅक (NAAC) पीअर टीम दौरा यशस्वीरीत्या संपन्न; B++ दर्जा संपादन."
                            : "NAAC Peer Team Visit successfully concluded with B++ grade."}
                        </p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm hover:border-emerald-900/30 hover:shadow-md transition-all flex gap-4 items-start group">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <p className="text-slate-700 leading-relaxed text-sm text-justify">
                          {isMarathi
                            ? "कॅम्पस प्लेसमेंट ड्राइव्ह २०२४ पुढील आठवड्यात आयोजित करण्यात आली आहे."
                            : "Campus Placement Drive 2024 scheduled for next week."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
            </div>
          </section>
        )}
        {showEvents && (
          <section className="py-8 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div id="events" className="mb-6">
                <div className="flex items-center gap-3 mb-8">
                  <Calendar className="text-amber-500" size={24} />
                  <h3 className="text-2xl font-serif text-emerald-950">
                    {isMarathi ? "आगामी कार्यक्रम व उपक्रम" : "Upcoming Events"}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event, idx) => {
                    const rawDate = String(event.date || "").trim();
                    const dateParts = rawDate.split(/\s+/);
                    let month = event.month || "";
                    let day = rawDate;

                    if (event.month) {
                      month = event.month;
                      day = rawDate;
                    } else if (dateParts.length >= 2) {
                      if (/^\d+$/.test(dateParts[0])) {
                        day = dateParts[0];
                        month = dateParts[1];
                      } else {
                        month = dateParts[0];
                        day = dateParts[1];
                      }
                    } else if (/^\d+$/.test(rawDate)) {
                      day = rawDate;
                      month = "EVENT";
                    }

                    return (
                      <div
                        key={idx}
                        className="flex bg-slate-50 border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="bg-emerald-900 text-white p-4 flex flex-col items-center justify-center min-w-[80px] text-center border-r border-emerald-800 shrink-0">
                          <span className="text-xl font-bold font-serif">
                            {day}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-amber-400">
                            {month}
                          </span>
                        </div>
                        <div className="p-5 flex-1">
                          <h4 className="font-bold text-emerald-950 mb-1 group-hover:text-emerald-700 transition-colors">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed text-justify">
                            {event.desc || event.description || event.location || ""}
                          </p>
                          {event.location && event.desc && event.location !== event.desc && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                              <MapPin size={12} className="text-amber-500 shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Programs & Initiatives */}
              <div id="programs" className="mb-6">
                <div className="flex items-center gap-3 mb-8">
                  <Heart className="text-amber-500" size={24} />
                  <h3 className="text-2xl font-serif text-emerald-950">
                    {isMarathi ? "मंडळाचे विशेष उपक्रम व सामाजिक प्रभाव" : "Trust Initiatives & Community Impact"}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-950 text-white p-8 md:p-10 rounded-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Users size={120} />
                    </div>
                    <h4 className="text-xl font-serif text-amber-400 mb-4 relative z-10">
                      {content[isMarathi ? "Campus_Program1_Title_Mr" : "Campus_Program1_Title"] ||
                        (isMarathi ? "ग्रामीण शिक्षण अभियान" : "Rural Education Drive")}
                    </h4>
                    <p className="text-emerald-100/90 leading-relaxed text-sm relative z-10 max-w-md whitespace-pre-wrap text-justify">
                      {content[isMarathi ? "Campus_Program1_Desc_Mr" : "Campus_Program1_Desc"] ||
                        (isMarathi
                          ? "तळागाळातील व ग्रामीण भागातील घटकांपर्यंत दर्जेदार शिक्षण पोहोचवण्यासाठी कटिबद्ध. मंडळ नियमित शैक्षणिक जनजागृती मोहिमा राबवते व ग्रामीण भागात पायाभूत सुविधा उभारते."
                          : "Committed to taking quality education to the grassroots. The trust organizes regular educational awareness campaigns and builds essential infrastructure in rural areas.")}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-8 md:p-10 rounded-sm relative overflow-hidden group hover:border-emerald-900/30 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                      <Award size={120} />
                    </div>
                    <h4 className="text-xl font-serif text-emerald-950 mb-4 relative z-10">
                      {content[isMarathi ? "Campus_Program2_Title_Mr" : "Campus_Program2_Title"] ||
                        (isMarathi ? "गुणवत्ता शिष्यवृत्ती व आर्थिक साहाय्य" : "Merit Scholarships & Financial Aid")}
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm relative z-10 max-w-md whitespace-pre-wrap text-justify">
                      {content[isMarathi ? "Campus_Program2_Desc_Mr" : "Campus_Program2_Desc"] ||
                        (isMarathi
                          ? "आर्थिक अडचणींमुळे कोणत्याही गुणवंत विद्यार्थ्याचे शिक्षण थांबू नये यासाठी सर्वोदय शिक्षण मंडळ गरजू व हुशार विद्यार्थ्यांना व्यापक शिष्यवृत्ती प्रदान करते."
                          : "Ensuring that financial constraints never hinder talent. Sarvodaya Shikshan Mandal proudly offers extensive scholarships to underprivileged and meritorious students across our network.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Grid */}
            </div>
          </section>
        )}
        {showGallery && (
          <section className="py-8 md:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div id="gallery">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-amber-500" size={24} />
                    <h3 className="text-2xl font-serif text-emerald-950">
                      {isMarathi ? "कॅम्पस छायाचित्र दालन" : "Campus Gallery"}
                    </h3>
                  </div>
                  <a
                    href="#"
                    className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-900 hover:text-amber-500 transition-colors"
                  >
                    {isMarathi ? "संपूर्ण दालन पहा" : "View Full Gallery"} <ArrowRight size={14} />
                  </a>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const galleryImages = Object.keys(content)
                      .filter(key => key.startsWith("Gallery_Image") && content[key] && content[key].trim() !== "")
                      .sort((a, b) => {
                         const numA = parseInt(a.replace("Gallery_Image", "")) || 0;
                         const numB = parseInt(b.replace("Gallery_Image", "")) || 0;
                         return numA - numB;
                      })
                      .map(key => content[key]);

                    if (galleryImages.length === 0) {
                      galleryImages.push(
                        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
                        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400",
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400"
                      );
                    }

                    return galleryImages.map((src, idx) => (
                      <div key={idx} className={`${idx === 0 ? 'col-span-2 row-span-2 h-64 md:h-auto' : 'h-40 md:h-48'} relative group overflow-hidden rounded-sm`}>
                        <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                        <ImageWithFallback
                          src={src}
                          alt={`Gallery image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Admissions Section */}
        {isHomePage && (
          <section
            id="admissions"
            className="py-8 md:py-10 bg-slate-50 border-t border-slate-200"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex items-center gap-4 mb-6 justify-center">
                <div className="w-16 h-px bg-slate-300"></div>
                <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                  {content[isMarathi ? "Admissions_PreTitle_Mr" : "Admissions_PreTitle"] ||
                    (isMarathi ? "प्रवेश प्रक्रिया" : "Join Us")}
                </span>
                <div className="w-16 h-px bg-slate-300"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 leading-tight mb-8 md:mb-6 text-center">
                {content[isMarathi ? "Admissions_MainTitle_Mr" : "Admissions_MainTitle"] ||
                  (isMarathi ? "प्रवेश प्रक्रिया २०२४-२५" : "Admissions 2024-25")}
              </h2>

              <div className="grid lg:grid-cols-2 gap-4">
                <div id="admission-process">
                  <h3 className="text-2xl font-serif text-emerald-950 mb-6 flex items-center gap-3">
                    {content[isMarathi ? "Admissions_Title_Mr" : "Admissions_Title"] ||
                      (isMarathi ? "अर्ज व प्रवेश पद्धती" : "Application Process")}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950">
                          {content[isMarathi ? "Admissions_Step1_Title_Mr" : "Admissions_Step1_Title"] ||
                            (isMarathi ? "ऑनलाइन नोंदणी" : "Online Registration")}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap text-justify">
                          {content[isMarathi ? "Admissions_Step1_Desc_Mr" : "Admissions_Step1_Desc"] ||
                            (isMarathi
                              ? "विद्यापीठाच्या अधिकृत पोर्टलवर केंद्रीय प्रवेश अर्ज भरा."
                              : "Fill out the centralized admission form on the university portal.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950">
                          {content[isMarathi ? "Admissions_Step2_Title_Mr" : "Admissions_Step2_Title"] ||
                            (isMarathi ? "कागदपत्र पडताळणी" : "Document Verification")}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap text-justify">
                          {content[isMarathi ? "Admissions_Step2_Desc_Mr" : "Admissions_Step2_Desc"] ||
                            (isMarathi
                              ? "महाविद्यालयाच्या पडताळणी केंद्रात मूळ कागदपत्रे व प्रती सादर करा."
                              : "Submit original documents at the college verification center.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-950">
                          {content[isMarathi ? "Admissions_Step3_Title_Mr" : "Admissions_Step3_Title"] ||
                            (isMarathi ? "गुणवत्ता यादी व प्रवेश निश्चिती" : "Merit List & Admission")}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 whitespace-pre-wrap text-justify">
                          {content[isMarathi ? "Admissions_Step3_Desc_Mr" : "Admissions_Step3_Desc"] ||
                            (isMarathi
                              ? "गुणवत्ता यादी तपासून विहित शुल्क भरून आपला प्रवेश तात्काळ निश्चित करा."
                              : "Check merit lists and secure admission by paying the requisite fees.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  id="scholarships"
                  className="bg-emerald-950 text-white p-10 rounded-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Award size={100} />
                  </div>
                  <h3 className="text-2xl font-serif mb-4 relative z-10 text-amber-400">
                    {content[isMarathi ? "Scholarships_Title_Mr" : "Scholarships_Title"] ||
                      (isMarathi ? "शिष्यवृत्ती व शुल्क सवलत" : "Scholarships & Freeships")}
                  </h3>
                  <p className="text-emerald-100/90 mb-8 leading-relaxed relative z-10 font-light whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Scholarships_Desc_Mr" : "Scholarships_Desc"] ||
                      (isMarathi
                        ? "आर्थिक मर्यादा गुणवत्तापूर्ण शिक्षणात अडथळा ठरू नये यावर आमचा दृढ विश्वास आहे. पात्र विद्यार्थ्यांना विविध शासकीय व संस्थात्मक शिष्यवृत्तींचा लाभ उपलब्ध करून दिला जातो."
                        : "We believe that financial constraints should not be a barrier to quality education. Deserving students can avail various government and institutional scholarships.")}
                  </p>
                  <div className="space-y-4 text-sm text-emerald-50 relative z-10 whitespace-pre-wrap">
                    {content[isMarathi ? "Scholarships_List_Mr" : "Scholarships_List"] ||
                      (isMarathi
                        ? "• भारत सरकार मॅट्रिकोत्तर शिष्यवृत्ती योजना (GOI Post Matric)\n• राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती योजना\n• पदव्युत्तर पदवी विद्यार्थ्यांसाठी एकलव्य शिष्यवृत्ती\n• गुणवंत व आर्थिकदृष्ट्या दुर्बल घटकांसाठी विशेष साहाय्य निधी"
                        : "• Government of India (GOI) Post Matric Scholarship\n• Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti\n• Eklavya Scholarship for Post-Graduate Students")}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials / Voices of Excellence */}
        {isHomePage && (
          <section className="py-8 md:py-10 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute top-1/2 -right-24 w-64 h-64 bg-amber-50 rounded-full opacity-50 blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-8 md:mb-6"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-px bg-slate-300"></div>
                  <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                    {isMarathi ? "हितचिंतकांची मते" : "Community Voices"}
                  </span>
                  <div className="w-12 h-px bg-slate-300"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 leading-tight">
                  {isMarathi ? "यशस्वी वाटचालीच्या यशोगाथा" : "Stories of Excellence"}
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-50 p-8 rounded-sm border border-slate-200 relative"
                >
                  <Quote
                    size={40}
                    className="text-amber-500/20 absolute top-6 right-6"
                  />
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed relative z-10 whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Testimonial1_Text_Mr" : "Testimonial1_Text"] ||
                      (isMarathi
                        ? `"सर्वोदय शिक्षण मंडळातील सर्वांगीण शैक्षणिक वातावरणामुळे माझा दृष्टिकोन समृद्ध झाला. येथील शिक्षकांनी केवळ पुस्तकी ज्ञान न देता जीवनातील आव्हानांना सामोरे जाण्याचे सामर्थ्य दिले."`
                        : `"The holistic environment at SSM transformed my perspective. The faculty didn't just teach the curriculum; they mentored us for life's real challenges."`)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-200 overflow-hidden">
                      <ImageWithFallback
                        src={
                          content["Testimonial1_Image"] ||
                          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
                        }
                        alt="Alumni"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">
                        {content[isMarathi ? "Testimonial1_Name_Mr" : "Testimonial1_Name"] ||
                          (isMarathi ? "प्रिया शर्मा" : "Priya Sharma")}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                        {content[isMarathi ? "Testimonial1_Title_Mr" : "Testimonial1_Title"] ||
                          (isMarathi ? "माजी विद्यार्थिनी, तुकडी २०१८" : "Alumna, Batch of 2018")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-emerald-900 p-8 rounded-sm border border-emerald-800 relative shadow-2xl transform md:-translate-y-4"
                >
                  <Quote
                    size={40}
                    className="text-white/10 absolute top-6 right-6"
                  />
                  <div className="flex gap-1 text-amber-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-emerald-100 italic mb-8 leading-relaxed relative z-10 whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Testimonial2_Text_Mr" : "Testimonial2_Text"] ||
                      (isMarathi
                        ? `"एक पालक म्हणून माझ्या मुलांसाठी यापेक्षा उत्तम संस्था असू शकत नाही. येथील शिस्त, सुसंस्कृत संस्कार आणि अभ्यासाचा दर्जा संपूर्ण मध्य भारतात अव्वल आहे."`
                        : `"As a parent, I couldn't have asked for a better institution. The discipline, the cultural values, and the academic rigor are unmatched in Central India."`)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 overflow-hidden">
                      <ImageWithFallback
                        src={
                          content["Testimonial2_Image"] ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
                        }
                        alt="Parent"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {content[isMarathi ? "Testimonial2_Name_Mr" : "Testimonial2_Name"] ||
                          (isMarathi ? "राजेश देशमुख" : "Rajesh Deshmukh")}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                        {content[isMarathi ? "Testimonial2_Title_Mr" : "Testimonial2_Title"] ||
                          (isMarathi ? "पालक" : "Parent")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-50 p-8 rounded-sm border border-slate-200 relative"
                >
                  <Quote
                    size={40}
                    className="text-amber-500/20 absolute top-6 right-6"
                  />
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic mb-8 leading-relaxed relative z-10 whitespace-pre-wrap text-justify">
                    {content[isMarathi ? "Testimonial3_Text_Mr" : "Testimonial3_Text"] ||
                      (isMarathi
                        ? `"अद्ययावत संशोधन सुविधा आणि व्यवस्थापनाच्या खंबीर पाठिंब्यामुळे आम्हाला नामांकित आंतरराष्ट्रीय नियतकालिकांमध्ये शोधनिबंध प्रकाशित करता आले."`
                        : `"The state-of-the-art research facilities and the support from the management enabled us to publish papers in top international journals."`)}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-200 overflow-hidden">
                      <ImageWithFallback
                        src={
                          content["Testimonial3_Image"] ||
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                        }
                        alt="Faculty"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">
                        {content[isMarathi ? "Testimonial3_Name_Mr" : "Testimonial3_Name"] ||
                          (isMarathi ? "डॉ. अमित पटेल" : "Dr. Amit Patel")}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                        {content[isMarathi ? "Testimonial3_Title_Mr" : "Testimonial3_Title"] ||
                          (isMarathi ? "ज्येष्ठ प्राध्यापक" : "Senior Faculty")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Careers Section */}
        {showCareers && (
          <section
            id="careers"
            className="py-16 md:py-24 bg-zinc-50 border-t border-zinc-200"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-[2px] bg-emerald-600"></div>
                    <span className="text-emerald-800 font-bold uppercase tracking-widest text-sm">
                      {content[isMarathi ? "Careers_PreTitle_Mr" : "Careers_PreTitle"] ||
                        (isMarathi ? "आमच्या परिवारात सामील व्हा" : "Join Our Team")}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif text-zinc-900 leading-tight">
                    {content[isMarathi ? "Careers_Title_Mr" : "Careers_Title"] ||
                      (isMarathi ? "नोकरीच्या संधी" : "Career Opportunities")}
                  </h2>
                </div>
                <div className="md:w-1/3 pb-2 flex flex-col items-start md:items-end gap-3">
                  <p className="text-zinc-600 text-lg leading-relaxed md:text-right">
                    {content[isMarathi ? "Careers_Desc_Mr" : "Careers_Desc"] ||
                      (isMarathi
                        ? "आमच्या शैक्षणिक संस्था संकुलात ज्ञानदान करण्यासाठी आम्ही समर्पित शिक्षक व कर्मचाऱ्यांचे स्वागत करतो."
                        : "We are always looking for passionate educators and professionals to join our network of institutions.")}
                  </p>
                  <button
                    onClick={() => setApplyingTo({ id: 'general', title: isMarathi ? 'सर्वसाधारण भरती अर्ज' : 'General Recruitment Application', department: 'Sarvodaya Shikshan Mandal', location: 'Chandrapur' })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    <Sparkles size={15} />
                    <span>{isMarathi ? "ऑनलाईन भरती अर्ज भरा" : "Apply Online Now"}</span>
                  </button>
                </div>
              </div>

              {/* Official Advertisement Notice Banner (PDF or JPEG / Image) */}
              {(advertisement?.hasFile || advertisement?.hasPdf || advertisement?.url) && (
                <div className="mb-10 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-xl border-2 border-amber-400/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start sm:items-center gap-4">
                      {advertisement.fileType === "image" ? (
                        <div
                          onClick={() => setPreviewLightboxImage(advertisement.url || advertisement.pdfUrl)}
                          className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 p-1 shrink-0 overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform group relative border-2 border-amber-300"
                          title="Click to view advertisement image"
                        >
                          <img
                            src={advertisement.url || advertisement.pdfUrl}
                            alt="Advertisement Notice"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye size={16} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 font-bold shadow-lg">
                          <FileText size={28} />
                        </div>
                      )}
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full mb-1">
                          <Sparkles size={12} />
                          <span>
                            {advertisement.fileType === "image"
                              ? (isMarathi ? "अधिकृत वर्तमानपत्र जाहिरात फोटो" : "Official Recruitment Ad (JPEG Image)")
                              : (isMarathi ? "अधिकृत वर्तमानपत्र जाहिरात (PDF)" : "Official Recruitment Ad (PDF Document)")}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
                          {advertisement.title || (isMarathi ? "सर्वोदय शिक्षण मंडळ भरती २०२६ - अधिकृत जाहिरात" : "Recruitment Notification & Terms 2026")}
                        </h3>
                        <p className="text-emerald-200/80 text-xs mt-1">
                          {advertisement.fileType === "image"
                            ? (isMarathi
                                ? "वर्तमानपत्रात प्रसिद्ध झालेली अधिकृत भरती जाहिरात पाहण्यासाठी खालील बटणावर क्लिक करा."
                                : "View or download the official recruitment notification clipping published in regional newspapers.")
                            : (isMarathi 
                                ? "पदांची पात्रता, आरक्षण व अटींची अधिकृत PDF जाहिरात डाउनलोड करून सविस्तर माहिती तपासा."
                                : "Download and review the official recruitment notice PDF for eligibility, reservations, and application instructions.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      {advertisement.fileType === "image" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewLightboxImage(advertisement.url || advertisement.pdfUrl)}
                            className="flex-1 md:flex-initial px-5 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <Eye size={16} />
                            <span>{isMarathi ? "जाहिरात फोटो पहा" : "View Advertisement Image"}</span>
                          </button>
                          <a
                            href={getDownloadUrl(advertisement.url || advertisement.pdfUrl, advertisement.originalName)}
                            download={advertisement.originalName || "SSM_Recruitment_Advertisement.jpg"}
                            className="flex-1 md:flex-initial px-4 py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-emerald-600/50"
                          >
                            <Download size={16} />
                            <span>{isMarathi ? "डाउनलोड" : "Download"}</span>
                          </a>
                        </>
                      ) : (
                        <a
                          href={getDownloadUrl(advertisement.url || advertisement.pdfUrl, advertisement.originalName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-initial px-5 py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Download size={16} />
                          <span>{isMarathi ? "जाहिरात PDF डाउनलोड" : "Download PDF Notice"}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Lightbox Modal for Advertisement Image */}
              {previewLightboxImage && (
                <div
                  className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4"
                  onClick={() => setPreviewLightboxImage(null)}
                >
                  <div
                    className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between p-3 border-b border-zinc-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <ImageIcon size={16} className="text-amber-600" />
                        {isMarathi ? "अधिकृत भरती जाहिरात (पूर्ण फोटो)" : "Official Recruitment Advertisement"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewLightboxImage(null)}
                        className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-2 overflow-auto max-h-[75vh] flex items-center justify-center bg-zinc-900/5">
                      <img
                        src={previewLightboxImage}
                        alt="Recruitment Advertisement"
                        className="max-h-[72vh] w-auto object-contain rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="p-3 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2">
                      <a
                        href={previewLightboxImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} /> {isMarathi ? "नवीन टॅबमध्ये उघडा" : "Open Full Size"}
                      </a>
                      <button
                        type="button"
                        onClick={() => setPreviewLightboxImage(null)}
                        className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 rounded-xl text-xs font-bold"
                      >
                        {isMarathi ? "बंद करा" : "Close"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {careers.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {careers.map((career, index) => (
                    <motion.div
                      key={career.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200 transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full">
                            {career.department}
                          </span>
                          <span className="px-4 py-1.5 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                            <MapPin size={12} /> {career.location}
                          </span>
                          {career.type && (
                            <span className="px-4 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-widest rounded-full">
                              {career.type}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-3xl font-serif text-zinc-900 mb-4 group-hover:text-emerald-700 transition-colors">
                          {career.title}
                        </h3>

                        {/* Position Attached Advertisement Button (PDF or JPEG) */}
                        {career.advertisementUrl && (
                          <div className="mb-6">
                            {career.advertisementType === "image" ? (
                              <button
                                type="button"
                                onClick={() => setPreviewLightboxImage(career.advertisementUrl)}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold transition-all shadow-2xs"
                              >
                                <ImageIcon size={14} className="text-amber-700" />
                                <span>{isMarathi ? "या पदाची अधिकृत जाहिरात पहा (फोटो)" : "View Position Ad (JPEG Image)"}</span>
                              </button>
                            ) : (
                              <a
                                href={getDownloadUrl(career.advertisementUrl)}
                                download={career.advertisementUrl.split('/').pop() || 'advertisement.pdf'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 text-xs font-bold transition-all shadow-2xs"
                              >
                                <FileText size={14} className="text-red-700" />
                                <span>{isMarathi ? "या पदाची अधिकृत जाहिरात पहा (PDF)" : "View Position Ad (PDF Document)"}</span>
                              </a>
                            )}
                          </div>
                        )}
                        
                        <div className="space-y-6 mb-8 mt-4">
                          <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                              {isMarathi ? "तपशील" : "Description"}
                            </h4>
                            <p className="text-zinc-700 leading-relaxed">
                              {career.description}
                            </p>
                          </div>
                          <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-200">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                              {isMarathi ? "पात्रता व अटी" : "Requirements"}
                            </h4>
                            <p className="text-zinc-700 leading-relaxed">
                              {career.requirements}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-zinc-100 mt-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setApplyingTo(career);
                          }}
                          className="flex items-center justify-between w-full group/btn cursor-pointer py-2 px-3 -mx-3 rounded-xl hover:bg-emerald-50 transition-colors"
                        >
                          <span className="text-sm font-bold uppercase tracking-widest text-emerald-700 group-hover/btn:text-emerald-800 transition-colors">
                            {isMarathi ? "अर्ज करा" : "Apply for this position"}
                          </span>
                          <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-colors shadow-xs">
                            <ArrowRight size={18} />
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                  <div className="p-12 md:p-20 text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
                      <Users size={32} />
                    </div>
                    <h3 className="text-2xl font-serif text-zinc-900 mb-4">No Open Positions</h3>
                    <p className="text-zinc-500 text-lg leading-relaxed mb-8">
                      {content[isMarathi ? "Careers_No_Openings_Mr" : "Careers_No_Openings"] ||
                        (isMarathi
                          ? "सध्या कोणत्याही जागा रिक्त नाहीत. कृपया नंतर पुन्हा तपासा."
                          : "There are currently no open positions. Our talent team is always reviewing applications, please check back later for new opportunities.")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contact / Admissions CTA */}

        {showContact && (
          <section
            id="contact"
            className="bg-emerald-950 py-8 md:py-10 relative text-white border-b-[12px] border-emerald-900"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                  {isMarathi ? "थेट संपर्क" : "Contact Us"}
                </h2>
                <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                  {content[isMarathi ? "Contact_Title_Mr" : "Contact_Title"] ||
                    (isMarathi ? "आमच्याशी संपर्क साधा" : "Get In Touch With Us")}
                </h3>
                <p className="text-emerald-100/70 text-lg leading-relaxed text-justify">
                  {content[isMarathi ? "Contact_Description_Mr" : "Contact_Description"] ||
                    (isMarathi
                      ? "प्रवेश, अभ्यासक्रम, वसतिगृह किंवा इतर कोणत्याही माहितीसाठी आमच्या मध्यवर्ती प्रशासकीय कार्यालयाशी संपर्क साधा. आमचे प्रतिनिधी आपणास सहकार्य करतील."
                      : "Whether you are a prospective student, a parent, or an alumnus, our administrative team is here to assist you with any inquiries regarding admissions, courses, or facilities.")}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 md:gap-24 items-center">
                {/* Image / Map Side */}
                <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden border border-emerald-800 shadow-2xl bg-emerald-950 flex flex-col">
                  <div className="flex-1 min-h-[300px] relative">
                    <iframe
                      src={
                        content["Contact_Map_URL"] ||
                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.1505342416327!2d79.29415497495574!3d20.211029115340157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2d33b4d45c553d%3A0x633e76a6cfd7fcbe!2sChandrapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1715011234567!5m2!1sen!2sin"
                      }
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                    ></iframe>
                  </div>

                  {/* Contact Card Below Map */}
                  <div className="bg-emerald-900 border-t border-emerald-800 p-6 relative z-10">
                    <div className="flex gap-4 items-start group">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-emerald-950 shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-sm">
                          {isMarathi ? "कार्यालयीन पत्ता" : "Campus Address"}
                        </h4>
                        <p className="text-emerald-50 leading-relaxed text-sm whitespace-pre-wrap text-justify">
                          {content[isMarathi ? "Contact_Address_Mr" : "Contact_Address"] ||
                            (isMarathi
                              ? "गंज वार्ड, चंद्रपूर - ४४२ ४०१\nमहाराष्ट्र, भारत"
                              : "Ganj Ward, Chandrapur - 442 401\nMaharashtra, India")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form & Direct Contact Side */}
                <div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex gap-4 items-start group">
                      <div className="w-12 h-12 rounded-full border border-emerald-800 flex items-center justify-center text-amber-500 group-hover:bg-emerald-900 transition-colors shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">
                          {isMarathi ? "दूरध्वनी" : "Call Us"}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {content["Contact_Phone"] || "+91 7172 255778"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start group">
                      <div className="w-12 h-12 rounded-full border border-emerald-800 flex items-center justify-center text-amber-500 group-hover:bg-emerald-900 transition-colors shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">
                          {isMarathi ? "ईमेल" : "Email Us"}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {content["Contact_Email"] || "sarvodayashikshanmandal@gmail.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">
                      {isMarathi ? "सोशल मीडियावर जोडा" : "Connect With Us"}
                    </h4>
                    <div className="flex gap-3">
                      <a
                        href={content["Social_Facebook"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <Facebook size={18} />
                      </a>
                      <a
                        href={content["Social_Twitter"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <Twitter size={18} />
                      </a>
                      <a
                        href={content["Social_Instagram"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <Instagram size={18} />
                      </a>
                      <a
                        href={content["Social_LinkedIn"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href={content["Social_YouTube"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <Youtube size={18} />
                      </a>
                      <a
                        href={content["Social_WhatsApp"] || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-300 hover:bg-amber-500 hover:text-emerald-950 hover:border-amber-500 transition-all"
                      >
                        <WhatsApp size={18} />
                      </a>
                    </div>
                  </div>

                  <div className="bg-emerald-900/50 border border-emerald-800 p-8 rounded-lg shadow-xl">
                    <h4 className="text-xl font-serif mb-6 text-white border-b border-emerald-800 pb-4">
                      {isMarathi ? "संदेश पाठवा" : "Send a Message"}
                    </h4>
                    {contactSuccess ? (
                      <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-6 rounded-lg text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="font-medium text-sm leading-relaxed">{contactSuccess}</p>
                        <button
                          type="button"
                          onClick={() => setContactSuccess("")}
                          className="mt-3 text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300 underline font-semibold"
                        >
                          {isMarathi ? "दुसरा संदेश पाठवा" : "Send another message"}
                        </button>
                      </div>
                    ) : (
                      <form
                        className="space-y-5"
                        onSubmit={handleContactSubmit}
                      >
                        <div>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder={isMarathi ? "आपले पूर्ण नाव" : "Your Full Name"}
                            className="w-full bg-emerald-950 border border-emerald-800 px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors rounded"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-5">
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder={isMarathi ? "आपला ईमेल" : "Your Email"}
                            className="w-full bg-emerald-950 border border-emerald-800 px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors rounded"
                          />
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder={isMarathi ? "आपला फोन नंबर" : "Your Phone Number"}
                            className="w-full bg-emerald-950 border border-emerald-800 px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors rounded"
                          />
                        </div>
                        <div>
                          <textarea
                            rows={4}
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder={isMarathi ? "आम्ही आपणास कशी मदत करू शकतो?" : "How can we help you?"}
                            className="w-full bg-emerald-950 border border-emerald-800 px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none rounded"
                          ></textarea>
                        </div>
                        <button
                          type="submit"
                          disabled={contactSending}
                          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-emerald-950 text-sm font-bold uppercase tracking-widest py-3.5 px-8 w-full transition-colors flex items-center justify-center gap-3 rounded shadow-lg cursor-pointer"
                        >
                          {contactSending
                            ? (isMarathi ? "पाठवत आहे..." : "Sending...")
                            : (isMarathi ? "संदेश पाठवा" : "Send Message")}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {singleInstId && (
          <SingleInstitutionPage instId={singleInstId} institutions={institutions} content={content} />
        )}

        {/* Alumni Portal */}
        <AnimatePresence>
          {isAlumni && <AlumniPortal isMarathi={isMarathi} />}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto bg-emerald-950 text-slate-300 border-t border-emerald-900 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-800/20 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-900/20 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
              {/* Brand & About */}
              <div className="space-y-5 lg:col-span-1">
                <div className="flex items-center gap-3">
                  {(content["Org_Logo_URL"] || "/images/logo.png") ? (
                    <ImageWithFallback src={content["Org_Logo_URL"] || "/images/logo.png"} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-emerald-700 p-0.5 flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-950 shadow-inner">
                      <span className="font-serif text-xl font-bold text-amber-500">
                        {content["Org_ShortName"]?.charAt(0) || "S"}
                      </span>
                    </div>
                  )}
                  <span className="text-lg font-serif font-bold text-white leading-tight">
                    {content[isMarathi ? "Footer_Name_Mr" : "Footer_Name"] ||
                      (isMarathi ? "सर्वोदय शिक्षण मंडळ" : "Sarvodaya Shikshan Mandal")}
                  </span>
                </div>
                <p className="text-sm text-emerald-100/70 leading-relaxed">
                  {isMarathi
                    ? (content["Org_Subtitle_Mr"] || "मध्य भारतातील अग्रगण्य शैक्षणिक संस्था संकुल").replace(/^(Trust Reg\. No\..*?•|रजि\.नं.*?•)\s*/i, '').replace(/^Trust Reg\. No\. F-09 \(C\) \(Chandrapur\)\s*•\s*/i, '').replace(/Central India's Premier Educational Network/i, 'मध्य भारतातील अग्रगण्य शैक्षणिक संस्था संकुल').replace(/^[•\s]+|[•\s]+$/g, '').trim()
                    : (content["Org_Subtitle_En"] || "Central India's Premier Educational Network").replace(/^[•\s]+|[•\s]+$/g, '').trim()}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-emerald-900/50 rounded-full text-[10px] font-bold text-amber-400 border border-emerald-800 tracking-wider">
                  {isMarathi
                    ? `नोंदणी क्र. ${MANDAL_REGISTRATION.regNo} (चंद्रपूर)`
                    : `Trust Reg. No. ${MANDAL_REGISTRATION.regNo} (Chandrapur)`}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  {isMarathi ? "महत्वाचे दुवे" : "Quick Links"}
                </h3>
                <ul className="space-y-3 text-sm text-emerald-100/80">
                  <li><Link to="/#about" onClick={(e) => handleHashClick(e, '#about')} className="hover:text-amber-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-emerald-700" /> {t("nav.about", "आमच्याबद्दल", "About Us")}</Link></li>
                  <li><Link to="/#institutions" onClick={(e) => handleHashClick(e, '#institutions')} className="hover:text-amber-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-emerald-700" /> {t("nav.institutions", "संस्था", "Institutions")}</Link></li>
                  <li><Link to="/alumni" className="hover:text-amber-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-emerald-700" /> {t("top.alumni", "माजी विद्यार्थी", "Alumni")}</Link></li>
                  <li><Link to={content["Nav_StudentPortal_URL"] || "/"} className="hover:text-amber-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-emerald-700" /> {t("top.studentPortal", "विद्यार्थी कक्ष", "Student Portal")}</Link></li>
                  <li><Link to="/careers" className="hover:text-amber-400 transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-emerald-700" /> {t("top.careers", "नोकरीच्या संधी", "Careers")}</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  {isMarathi ? "संपर्क" : "Contact Us"}
                </h3>
                <ul className="space-y-4 text-sm text-emerald-100/80">
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {isMarathi ? "चंद्रपूर, महाराष्ट्र" : "Chandrapur, Maharashtra"} <br/>
                      <span className="text-emerald-700/80 text-xs font-semibold tracking-wider uppercase mt-1 block">
                        {isMarathi ? `स्थापना: ${MANDAL_REGISTRATION.est}` : `Est. ${MANDAL_REGISTRATION.est}`}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={16} className="text-amber-500 shrink-0" />
                    <a href={`tel:${content["Contact_Phone"] || "07172 - 255778"}`} className="hover:text-amber-400 transition-colors">
                      {content["Contact_Phone"] || "07172 - 255778"}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={16} className="text-amber-500 shrink-0" />
                    <a href={`mailto:${content["Contact_Email"] || "sarvodayashikshanmandal@gmail.com"}`} className="hover:text-amber-400 transition-colors">
                      {content["Contact_Email"] || "sarvodayashikshanmandal@gmail.com"}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  {isMarathi ? "सोशल मीडिया" : "Connect With Us"}
                </h3>
                <p className="text-sm text-emerald-100/70 mb-5 leading-relaxed">
                  {isMarathi ? "आमच्या सर्व शैक्षणिक घडामोडी आणि बातम्यांसाठी सोशल मीडियावर फॉलो करा." : "Follow us on social media for the latest educational updates and news."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {content["Social_Facebook"] && (
                    <a href={content["Social_Facebook"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm">
                      <Facebook size={18} />
                    </a>
                  )}
                  {content["Social_Twitter"] && (
                    <a href={content["Social_Twitter"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm">
                      <Twitter size={18} />
                    </a>
                  )}
                  {content["Social_Instagram"] && (
                    <a href={content["Social_Instagram"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm">
                      <Instagram size={18} />
                    </a>
                  )}
                  {content["Social_LinkedIn"] && (
                    <a href={content["Social_LinkedIn"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {content["Social_YouTube"] && (
                    <a href={content["Social_YouTube"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm">
                      <Youtube size={18} />
                    </a>
                  )}
                  {!content["Social_Facebook"] && !content["Social_Twitter"] && !content["Social_Instagram"] && !content["Social_LinkedIn"] && !content["Social_YouTube"] && (
                    <>
                      <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm"><Facebook size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm"><Twitter size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm"><Instagram size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm"><Linkedin size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition-colors text-white border border-emerald-800 shadow-sm"><Youtube size={18} /></a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[11px] sm:text-xs text-emerald-100/50">
                © {new Date().getFullYear()}{" "}
                {content[isMarathi ? "Footer_Copyright_Mr" : "Footer_Copyright"] ||
                  (isMarathi
                    ? "सर्वोदय शिक्षण मंडळ, चंद्रपूर. सर्व हक्क राखीव."
                    : "Sarvodaya Shikshan Mandal, Chandrapur. All rights reserved.")}
              </p>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] sm:text-xs uppercase tracking-widest font-bold items-center text-emerald-100/60">
                <Link to="/" className="hover:text-amber-400 transition-colors">{isMarathi ? "गोपनीयता" : "Privacy"}</Link>
                <Link to="/" className="hover:text-amber-400 transition-colors">{isMarathi ? "अटी व शर्ती" : "Terms"}</Link>
                <Link to="/" className="hover:text-amber-400 transition-colors">{isMarathi ? "साइटमॅप" : "Sitemap"}</Link>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 md:ml-4 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-800">
                  <Settings size={12} /> {isMarathi ? "प्रशासक" : "Admin"}
                </Link>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2 bg-emerald-950/40 rounded-xl sm:rounded-full border border-emerald-900/60">
                <span className="text-emerald-100/50 text-[10px] sm:text-xs tracking-wider uppercase font-medium">
                  {isMarathi ? "संकल्पना आणि विकास:" : "Architected & Developed by"} <span className="font-bold text-amber-500/90 ml-1">Dr. Krishna Karoo</span>
                </span>
                <div className="hidden sm:block w-px h-3 bg-emerald-100/20"></div>
                <a 
                  href="https://wa.me/919423403193" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-100/60 hover:text-green-400 transition-colors text-[11px] sm:text-xs font-semibold"
                >
                  <MessageCircle size={14} className="text-green-500" />
                  <span>9423403193</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Global Styles for Marquee */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `,
        }}
      />

      {/* Full-Page Detailed Job Application Portal */}
      <AnimatePresence>
        {(applyingTo || isApplyRoute) && (
          <JobApplicationPage
            career={applyingTo && applyingTo.id !== "general" ? applyingTo : null}
            onClose={() => {
              setApplyingTo(null);
              if (isApplyRoute) {
                navigate("/careers");
              }
            }}
            isMarathi={isMarathi}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
