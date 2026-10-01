import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
  Calendar,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  Quote,
  Maximize2,
  X,
  Globe,
  Compass,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Edit3
} from "lucide-react";
import { MANDAL_INSTITUTIONS, InstitutionContact, MANDAL_REGISTRATION } from "../data/mandalData";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  instId: string;
  institutions?: any[];
  content?: Record<string, string>;
}

export const InstitutionDetailView: React.FC<Props> = ({
  instId,
  institutions = [],
  content = {},
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; subtitle: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { language, setLanguage, isMarathi, t } = useLanguage();
  const lang = language;
  const setLang = (newLang: "mr" | "en") => setLanguage(newLang);

  // Find the institution from backend or fallback data
  const fallbackInst = MANDAL_INSTITUTIONS.find((i) => String(i.id) === String(instId));
  const backendInst = institutions.find((i) => String(i.id) === String(instId));
  const inst = backendInst ? { ...fallbackInst, ...backendInst } : fallbackInst;

  if (!inst) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
          <Building2 size={32} />
        </div>
        <h2 className="text-3xl font-serif text-slate-900 mb-3 font-bold">
          {isMarathi ? "संस्था आढळली नाही" : "Institution Not Found"}
        </h2>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          {isMarathi
            ? "विनंती केलेली शैक्षणिक संस्था आमच्या निर्देशिकेत आढळली नाही. कृपया आमची संपूर्ण संस्था निर्देशिका पहा."
            : "The requested educational institution could not be located in our directory. Please browse our complete institutional registry."}
        </p>
        <Link
          to="/institutions"
          className="inline-flex items-center gap-2 bg-emerald-950 text-amber-400 hover:bg-emerald-900 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          <ArrowLeft size={16} /> {isMarathi ? "सर्व संस्था व निर्देशिका पहा" : "View All Institutions & Directory"}
        </Link>
      </div>
    );
  }

  // Dynamic values prioritized from Firestore content_blocks, then backend inst, then static fallback
  const nameMarathi = content[`Inst_${inst.id}_NameMarathi`] || fallbackInst?.nameMarathi || inst.nameMarathi || inst.name;
  const nameEnglish = content[`Inst_${inst.id}_NameEnglish`] || fallbackInst?.nameEnglish || inst.nameEnglish || inst.name;
  const bannerImage = content[`Inst_${inst.id}_BannerImage`] || inst.imageUrl || fallbackInst?.imageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80";
  const websiteLink = content[`Inst_${inst.id}_WebsiteLink`] || inst.link || fallbackInst?.link || "";

  // Head / Principal Details
  const headName = content[`Inst_${inst.id}_HeadName`] || fallbackInst?.headNameEnglish || inst.headNameEnglish || "";
  const headNameMarathi = content[`Inst_${inst.id}_HeadNameMarathi`] || fallbackInst?.headNameMarathi || "";
  const headNameEnglish = content[`Inst_${inst.id}_HeadNameEnglish`] || fallbackInst?.headNameEnglish || "";
  const headTitle = content[`Inst_${inst.id}_HeadTitle`] || fallbackInst?.headDesignationEnglish || inst.headDesignationEnglish || "Principal";
  const headPhoto = content[`Inst_${inst.id}_HeadImage`] || fallbackInst?.headPhoto || "/images/dummy.png";
  const headQualifications = content[`Inst_${inst.id}_HeadQualifications`] || fallbackInst?.headQualifications || "";
  const headQuote = isMarathi
    ? (content[`Inst_${inst.id}_HeadQuote_Mr`] || (inst as any).headQuoteMarathi || (fallbackInst as any)?.headQuoteMarathi || (inst.id === 1 ? "उच्च शिक्षणाने केवळ पारंपरिक वर्गखोलीपुरते मर्यादित न राहता विद्यार्थ्यांमध्ये वैज्ञानिक जिज्ञासा, नैतिक मूल्ये आणि ग्रामीण युवा सक्षमीकरण घडवून आणले पाहिजे." : inst.id === 2 ? "समाजकार्य हा केवळ एक व्यवसाय नसून वंचितांच्या उत्थानासाठी व मानवी प्रतिष्ठा जपण्यासाठी घेतलेली एक पवित्र प्रतिज्ञा आहे." : inst.id === 3 ? "न्याय ही सामाजिक संस्थांची सर्वोच्च प्रेरणा आहे; संविधानाची मूलभूत मूल्ये जपणारे निर्भीड विधिज्ञ घडवणे हे आमचे कर्तव्य आहे." : inst.id === 4 ? "आदिवासी व दुर्गम सीमाभागात आधुनिक उच्च शिक्षण पोहोचवणे हीच आमची खरी राष्ट्रसेवा आहे." : inst.id === 5 ? "गतिमान व्यावसायिक नेतृत्वासाठी धोरणात्मक सखोलता, नवोपक्रमशील दृष्टी आणि ठाम नैतिकतेची आवश्यकता असते." : "शिक्षणाचा खरा उद्देश केवळ पदवी मिळवणे नसून नैतिक चारित्र्य, वैज्ञानिक दृष्टिकोन आणि समाजाप्रती समर्पण भाव निर्माण करणे हा आहे."))
    : (content[`Inst_${inst.id}_HeadQuote`] || fallbackInst?.headQuote || inst.headQuote || "");
  const headMessage = isMarathi
    ? (content[`Inst_${inst.id}_HeadMessage_Mr`] || (inst as any).headMessageMarathi || (fallbackInst as any)?.headMessageMarathi || `${nameMarathi} येथे आमचे समर्पित प्राध्यापक, शिक्षक व कर्मचारी विद्यार्थ्यांच्या सर्वांगीण विकासासाठी कटिबद्ध आहेत. आम्ही विद्यार्थ्यांना उच्च दर्जाचे शिक्षण, अद्ययावत तंत्रज्ञान आणि मूल्यशिक्षणाची अखंड परंपरा प्रदान करत आहोत.`)
    : (content[`Inst_${inst.id}_HeadMessage`] || fallbackInst?.headMessage || inst.headMessage || "");
  const headPhone = content[`Inst_${inst.id}_HeadPhone`] || (fallbackInst?.phones && fallbackInst.phones[0]) || "";
  const headEmail = content[`Inst_${inst.id}_HeadEmail`] || (fallbackInst?.emails && fallbackInst.emails[0]) || "";

  // Academic & Campus Details
  const category = content[`Inst_${inst.id}_Category`] || inst.type || fallbackInst?.category || "Educational Institution";
  const establishedYear = content[`Inst_${inst.id}_EstYear`] || fallbackInst?.establishedYear || "1970";
  const affiliation = isMarathi
    ? (content[`Inst_${inst.id}_Affiliation_Mr`] || (fallbackInst as any)?.affiliationMarathi || (fallbackInst?.category === "College" ? "गोंडवाना विद्यापीठ गडचिरोली संलग्नित • महाराष्ट्र शासन मान्यताप्राप्त" : "महाराष्ट्र राज्य माध्यमिक व उच्च माध्यमिक शिक्षण मंडळ, पुणे मान्यताप्राप्त"))
    : (content[`Inst_${inst.id}_Affiliation`] || fallbackInst?.affiliation || "Affiliated to Gondwana University, Gadchiroli");
  const aboutText = isMarathi
    ? (content[`Inst_${inst.id}_AboutText_Mr`] || (fallbackInst as any)?.descriptionMarathi || (inst as any).descriptionMarathi || `${nameMarathi} ही सर्वोदय शिक्षण मंडळाच्या अंतर्गत संचालित एक अग्रगण्य शैक्षणिक संस्था असून ती या परिसरातील विद्यार्थ्यांच्या सर्वांगीण प्रगतीसाठी अविरत कार्यरत आहे. आधुनिक अभ्यासक्रम, सुसज्ज प्रयोगशाळा आणि अनुभवी मार्गदर्शकांच्या सहकार्याने संस्था दर्जेदार शिक्षण पुरविते.`)
    : (content[`Inst_${inst.id}_AboutText`] || fallbackInst?.description || inst.description || "");
  const address = isMarathi
    ? (content[`Inst_${inst.id}_Address_Mr`] || (fallbackInst as any)?.addressMarathi || `${fallbackInst?.talukaDistrictMarathi || "चंद्रपूर"}, महाराष्ट्र, भारत`)
    : (content[`Inst_${inst.id}_Address`] || fallbackInst?.address || `${fallbackInst?.talukaDistrictEnglish || "Chandrapur"}, Maharashtra, India`);
  const locationText = fallbackInst ? (isMarathi ? fallbackInst.talukaDistrictMarathi : fallbackInst.talukaDistrictEnglish) : (isMarathi ? "चंद्रपूर" : "Chandrapur");

  const coursesList: string[] = isMarathi
    ? ((fallbackInst as any)?.coursesMarathi || [
        "पदवी व पदव्युत्तर उच्च शिक्षण अभ्यासक्रम",
        "व्यावसायिक व कौशल्य विकास प्रशिक्षण",
        "संगणक व माहिती तंत्रज्ञान प्रात्यक्षिके",
        "व्यक्तिमत्त्व विकास व स्पर्धा परीक्षा मार्गदर्शन",
      ])
    : (fallbackInst?.courses || [
        "Undergraduate Degree Programs",
        "Postgraduate Degree Programs",
        "Vocational & Skill Development",
        "Computer & IT Practical Certifications",
      ]);

  const facilitiesList: string[] = isMarathi
    ? ((fallbackInst as any)?.facilitiesMarathi || [
        "सुसज्ज व अद्ययावत आधुनिक प्रयोगशाळा",
        "संगणकीकृत मध्यवर्ती ग्रंथालय व अभ्यासिका",
        "हाय-स्पीड कॅम्पस वाय-फाय व डिजिटल वर्गखोल्या",
        "भव्य क्रीडांगण व व्यायामशाळा (जिम)",
        "विद्यार्थी साहाय्य व करिअर मार्गदर्शन कक्ष",
      ])
    : (fallbackInst?.facilities || [
        "Well-Equipped Modern Laboratories",
        "Central Computerized Library & Reading Hall",
        "High-Speed Campus Internet & Digital Classrooms",
        "Sports Ground & Gymnasium",
        "Student Support & Career Guidance Cell",
      ]);

  // Filter out other institutions for the quick navigation footer
  const otherInstitutions = MANDAL_INSTITUTIONS.filter((item) => String(item.id) !== String(inst.id));

  // Extract clean domain for display
  const getDomainFromUrl = (url: string) => {
    try {
      if (!url || url === "#") return "";
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${nameEnglish} | ${MANDAL_REGISTRATION.nameEnglish}`,
        text: `Explore ${nameEnglish} - ${category} under Sarvodaya Shikshan Mandal.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const domain = getDomainFromUrl(websiteLink);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* Top Breadcrumbs & Utility Bar */}
      <div className="bg-emerald-950 text-slate-300 border-b border-emerald-900/60 sticky top-0 z-30 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Link to="/" className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
              <Compass size={14} /> {isMarathi ? "मुख्यपृष्ठ" : "Home"}
            </Link>
            <span className="text-slate-500">/</span>
            <Link to="/institutions" className="text-slate-300 hover:text-white truncate">
              {isMarathi ? "संस्था व निर्देशिका" : "Institutions & Directory"}
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-amber-300 font-bold truncate max-w-[200px] md:max-w-xs">
              {isMarathi ? nameMarathi : nameEnglish}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="inline-flex rounded-md bg-emerald-900/80 p-0.5 border border-emerald-800 text-[11px] font-bold">
              <button
                onClick={() => setLang("mr")}
                className={`px-2 py-0.5 rounded ${isMarathi ? "bg-amber-500 text-emerald-950" : "text-slate-300 hover:text-white"}`}
              >
                मराठी
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded ${!isMarathi ? "bg-amber-500 text-emerald-950" : "text-slate-300 hover:text-white"}`}
              >
                English
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-white font-medium transition-colors"
              title="Share or Copy Link"
            >
              <Share2 size={13} className="text-amber-400" />
              <span className="hidden sm:inline">
                {copiedLink ? (isMarathi ? "कॉपी झाले!" : "Copied!") : (isMarathi ? "शेअर" : "Share")}
              </span>
            </button>

            {/* Admin Edit Link */}
            <Link
              to={`/admin/institution-content/${inst.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 transition-colors"
              title="Edit in Admin Panel"
            >
              <Edit3 size={12} />
              <span className="hidden md:inline">{isMarathi ? "प्रशासक संपादन" : "Edit in Admin"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative bg-emerald-950 text-white overflow-hidden border-b-4 border-amber-500">
        {/* Background Image with Deep Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImage}
            alt={isMarathi ? nameMarathi : nameEnglish}
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/85 to-emerald-950/70"></div>
          {/* Subtle Grid Accent */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "radial-gradient(#f59e0b 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-16 md:py-20">
          <div className="max-w-4xl">
            {/* Badges & Meta */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 md:gap-3 mb-4"
            >
              <span className="bg-amber-500 text-emerald-950 text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-sm tracking-wider flex items-center gap-1">
                <Sparkles size={13} /> {isMarathi ? (fallbackInst?.category === "College" ? "महाविद्यालय" : "शाळा व कनिष्ठ महाविद्यालय") : category}
              </span>
              {establishedYear && (
                <span className="bg-emerald-900/90 text-amber-300 border border-emerald-700/60 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar size={13} /> {isMarathi ? `स्थापना वर्ष ${establishedYear}` : `Est. ${establishedYear}`}
                </span>
              )}
              <span className="bg-emerald-900/90 text-slate-200 border border-emerald-700/60 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={13} className="text-amber-400" /> {isMarathi ? fallbackInst?.talukaDistrictMarathi || "चंद्रपूर" : fallbackInst?.talukaDistrictEnglish || "Chandrapur"}
              </span>
            </motion.div>

            {/* Bilingual Institution Names */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
                {isMarathi ? nameMarathi : nameEnglish}
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl mb-8 flex items-start gap-2">
                <Award size={18} className="text-amber-400 shrink-0 mt-1" />
                <span>
                  {isMarathi
                    ? (fallbackInst?.affiliation ? "गोंडवाना विद्यापीठ, गडचिरोली संलग्नित • नॅक 'A' दर्जा" : "गोंडवाना विद्यापीठ, गडचिरोली संलग्नित")
                    : affiliation}
                </span>
              </p>
            </motion.div>

            {/* Call To Action Buttons (Prominent Official Website Link) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {websiteLink && websiteLink !== "#" ? (
                <a
                  href={websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-emerald-950 font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-amber-500/20 text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 border border-amber-300"
                >
                  <Globe size={18} className="text-emerald-950 group-hover:rotate-12 transition-transform" />
                  <span>{isMarathi ? "अधिकृत संकेतस्थळास भेट द्या" : "Visit Official Website"}</span>
                  <ExternalLink size={16} className="text-emerald-950 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 bg-slate-800 text-slate-400 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  <Globe size={16} /> {isMarathi ? "अधिकृत वेब पोर्टल (संस्थेशी संपर्क करा)" : "Official Web Portal (Contact Mandal)"}
                </button>
              )}

              {fallbackInst?.phones && fallbackInst.phones.length > 0 && (
                <a
                  href={`tel:${fallbackInst.phones[0]}`}
                  className="inline-flex items-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 text-white font-semibold px-5 py-3.5 rounded-xl border border-emerald-700/80 text-sm transition-all"
                >
                  <Phone size={16} className="text-amber-400" />
                  <span>{isMarathi ? `संपर्क: ${fallbackInst.phones[0]}` : `Call: ${fallbackInst.phones[0]}`}</span>
                </a>
              )}

              {fallbackInst?.emails && fallbackInst.emails.length > 0 && (
                <a
                  href={`mailto:${fallbackInst.emails[0]}`}
                  className="inline-flex items-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 text-white font-semibold px-5 py-3.5 rounded-xl border border-emerald-700/80 text-sm transition-all"
                >
                  <Mail size={16} className="text-amber-400" />
                  <span className="truncate max-w-[180px]">{isMarathi ? "ईमेल पाठवा" : "Email Campus"}</span>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">

        {/* 1. PRINCIPAL / HEAD OF INSTITUTION SPOTLIGHT SECTION */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                  {isMarathi ? "प्राचार्यांचे दालन • संस्था प्रमुख" : "Leadership Desk • Head of Institution"}
                </span>
                <div className="w-16 h-0.5 bg-amber-500"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-emerald-950 font-bold">
                {isMarathi ? "प्राचार्यांचे मनोगत व संदेश" : "Message from the Principal / Head of Institution"}
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span>{isMarathi ? "संस्था प्रमुख" : "Institutional Executive Head"}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl border border-emerald-100/80 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Principal's Portrait & Official Profile Card */}
              <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col items-center text-center bg-gradient-to-b from-emerald-950 to-slate-950 text-white relative">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

                {/* Principal's Photo Frame */}
                <div className="relative group mb-6 mt-2">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative w-64 h-80 sm:w-72 sm:h-92 md:w-80 md:h-96 rounded-2xl overflow-hidden border-2 border-amber-400/90 shadow-2xl bg-slate-900">
                    <img
                      src={headPhoto}
                      alt={isMarathi ? headNameMarathi || headName : headNameEnglish || headName || "Principal"}
                      className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/dummy.png";
                      }}
                    />
                    {/* Dark gradient at bottom of photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Expand Zoom Button */}
                    <button
                      onClick={() =>
                        setSelectedPhoto({
                          url: headPhoto,
                          title: isMarathi ? headNameMarathi || headName : headNameEnglish || headName,
                          subtitle: isMarathi
                            ? `${fallbackInst?.headDesignationMarathi || "प्राचार्य"} - ${nameMarathi}`
                            : `${fallbackInst?.headDesignationEnglish || "Principal"} - ${nameEnglish}`,
                        })
                      }
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/90 text-amber-400 p-2 rounded-lg border border-amber-400/40 backdrop-blur-sm transition-all"
                      title={isMarathi ? "मोठा फोटो पहा" : "View High-Resolution Portrait"}
                    >
                      <Maximize2 size={16} />
                    </button>

                    <div className="absolute bottom-3 left-3 text-left">
                      <span className="text-[11px] font-mono uppercase bg-amber-500 text-emerald-950 font-extrabold px-2 py-0.5 rounded">
                        {isMarathi ? (fallbackInst?.headDesignationMarathi || "प्राचार्य") : (fallbackInst?.headDesignationEnglish || "Principal")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Principal's Credentials */}
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                  {isMarathi ? headNameMarathi || headName : headNameEnglish || headName}
                </h3>
                
                <div className="inline-block bg-emerald-900/80 border border-emerald-700/60 rounded-full px-4 py-1 text-xs text-slate-200 font-medium mb-3">
                  {isMarathi ? (fallbackInst?.headDesignationMarathi || "प्राचार्य") : (fallbackInst?.headDesignationEnglish || "Principal")}
                </div>

                {headQualifications && (
                  <p className="text-xs text-amber-200/90 font-mono tracking-wide mb-6 max-w-xs">
                    {headQualifications}
                  </p>
                )}

                {/* Direct Principal Contact Details */}
                <div className="w-full pt-5 border-t border-emerald-900/80 flex flex-col gap-2.5 text-xs text-left">
                  {headPhone && (
                    <div className="flex items-center gap-2.5 text-slate-300 bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/40">
                      <Phone size={14} className="text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                          {isMarathi ? "कार्यालयीन दूरध्वनी" : "Principal Office Phone"}
                        </span>
                        <a href={`tel:${headPhone}`} className="hover:text-amber-300 font-bold text-white">
                          {headPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {headEmail && (
                    <div className="flex items-center gap-2.5 text-slate-300 bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/40">
                      <Mail size={14} className="text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                          {isMarathi ? "अधिकृत ईमेल" : "Official Email"}
                        </span>
                        <a href={`mailto:${headEmail}`} className="hover:text-amber-300 font-medium text-white truncate block">
                          {headEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-slate-300 bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/40">
                    <Clock size={14} className="text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                        {isMarathi ? "भेटण्याची वेळ" : "Visiting Hours"}
                      </span>
                      <span className="text-xs text-slate-200 font-medium">
                        {isMarathi ? "सकाळी ११:०० ते दुपारी २:०० (कामाचे दिवस)" : "11:00 AM – 2:00 PM (Working Days)"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Principal's Inspiring Message & Vision */}
              <div className="lg:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-between">
                <div>
                  {/* Quote Accent */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700">
                      <Quote size={24} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                        {isMarathi ? "दृष्टी व शैक्षणिक ध्येय" : "Vision & Academic Creed"}
                      </span>
                      <span className="text-xs text-slate-500 font-serif">
                        {isMarathi ? MANDAL_REGISTRATION.nameMarathi : MANDAL_REGISTRATION.nameEnglish}
                      </span>
                    </div>
                  </div>

                  {/* Highlight Quote */}
                  {headQuote && (
                    <blockquote className="text-xl sm:text-2xl font-serif text-emerald-950 font-bold mb-6 leading-snug border-l-4 border-amber-500 pl-5 py-1">
                      "{headQuote}"
                    </blockquote>
                  )}

                  {/* Full Message Text */}
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-justify space-y-4 mb-8 text-base">
                    {headMessage ? (
                      headMessage.split("\n\n").map((para, idx) => (
                        <p key={idx} className="leading-relaxed whitespace-pre-wrap">
                          {para}
                        </p>
                      ))
                    ) : (
                      <p>
                        {isMarathi
                          ? `${nameMarathi} येथे आमचे समर्पित प्राध्यापक व कर्मचारी विद्यार्थ्यांच्या बौद्धिक, नैतिक व सर्वांगीण विकासासाठी कटिबद्ध आहेत. आम्ही पालक व विद्यार्थ्यांना या ज्ञानप्रवासात सहभागी होण्याचे आवाहन करतो.`
                          : `At ${nameEnglish}, our dedicated faculty and staff work relentlessly to create an environment where intellectual curiosity thrives, moral character is forged, and students are empowered to achieve their highest academic and career aspirations. We invite parents and students to be part of this transformative journey.`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sign-off & Institutional Seal */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-100/60 p-4 rounded-xl">
                  <div>
                    <p className="font-serif font-bold text-emerald-950 text-base">
                      {isMarathi ? headNameMarathi || headName : headNameEnglish || headName}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {isMarathi ? (fallbackInst?.headDesignationMarathi || "प्राचार्य") : (fallbackInst?.headDesignationEnglish || "Principal")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isMarathi ? nameMarathi : nameEnglish}
                    </p>
                  </div>
                  
                  <div className="text-right sm:border-l border-slate-300 sm:pl-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded border border-emerald-200">
                      <CheckCircle2 size={12} className="text-emerald-700" /> {isMarathi ? "प्रमाणित संस्था नेतृत्व" : "Certified Leadership"}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 2. OFFICIAL WEBSITE FEATURE CALLOUT CARD (HIGH VISIBILITY) */}
        {websiteLink && websiteLink !== "#" && (
          <section className="mb-16">
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden border-2 border-amber-400/80">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/30 mb-3">
                    <Globe size={14} /> {isMarathi ? "अधिकृत वेब पोर्टल" : "Official Web Portal"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                    {isMarathi ? `${nameMarathi} शी थेट संपर्क साधा` : `Connect Directly with ${nameEnglish}`}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {isMarathi
                      ? "परीक्षेच्या सूचना, प्राध्यापक संपर्क, अभ्यासक्रम, प्रवेश अर्ज, NAAC दस्तऐवज आणि विभागातील कामगिरी थेट अधिकृत कॉलेज संकेतस्थळावर पहा."
                      : "Access real-time examination notices, faculty contacts, academic syllabus, admissions forms, NAAC documentation, and departmental achievements directly on the official college website."}
                  </p>
                  
                  {/* Address bar mockup */}
                  <div className="inline-flex items-center gap-2 bg-black/40 border border-slate-700/80 rounded-lg px-4 py-2 text-xs font-mono text-amber-300">
                    <span className="text-emerald-400">🔒</span>
                    <span className="text-slate-400">https://</span>
                    <span className="font-bold text-white">{domain || websiteLink}</span>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <a
                    href={websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg transition-all transform hover:scale-105"
                  >
                    <span>{isMarathi ? "कॉलेज पोर्टलला भेट द्या" : "Visit College Portal"}</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. INSTITUTION OVERVIEW & ACADEMIC OFFERINGS GRID */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* About Institution */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                  {isMarathi ? "संस्था परिचय व वारसा" : "Overview & Heritage"}
                </span>
                <div className="w-12 h-0.5 bg-emerald-900"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4">
                {isMarathi ? "संस्थेबद्दल माहिती" : "About the Institution"}
              </h3>
              <div className="prose prose-slate text-slate-700 leading-relaxed text-justify space-y-4">
                <p className="text-lg leading-relaxed font-serif text-slate-800 border-l-2 border-emerald-800 pl-4">
                  {aboutText}
                </p>
                <p>
                  {isMarathi
                    ? "सर्वोदय शिक्षण मंडळाच्या दूरदर्शी मार्गदर्शनाखाली, हे महाविद्यालय राष्ट्रीय शैक्षणिक निकषांनुसार आधुनिक शिक्षण सुविधा, संशोधन पायाभूत सुविधा आणि समाजसेवा उपक्रमांचा निरंतर विस्तार करत आहे."
                    : "Governed under the visionary guidance of Sarvodaya Shikshan Mandal, this campus continues to expand modern learning facilities, research infrastructure, and community service initiatives to meet national education standards."}
                </p>
              </div>

              {/* Quick Key Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isMarathi ? "प्रवर्ग" : "Category"}
                  </span>
                  <span className="text-sm font-bold text-emerald-950">
                    {isMarathi ? (fallbackInst?.category === "College" ? "महाविद्यालय" : "शाळा व कनिष्ठ महाविद्यालय") : category}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isMarathi ? "स्थापना वर्ष" : "Established"}
                  </span>
                  <span className="text-sm font-bold text-emerald-950">{establishedYear}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isMarathi ? "स्थान" : "Location"}
                  </span>
                  <span className="text-sm font-bold text-emerald-950">
                    {isMarathi ? fallbackInst?.talukaDistrictMarathi || "चंद्रपूर" : fallbackInst?.talukaDistrictEnglish || "Chandrapur"}
                  </span>
                </div>
              </div>
            </div>

            {/* Courses & Facilities Box */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Courses Card */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-xl mb-4">
                  <BookOpen size={20} className="text-amber-600" />
                  <h4>{isMarathi ? "प्रमुख शैक्षणिक अभ्यासक्रम" : "Key Academic Programs"}</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {coursesList.map((course, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Facilities Card */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-900 font-serif font-bold text-xl mb-4">
                  <Building2 size={20} className="text-amber-600" />
                  <h4>{isMarathi ? "कॅम्पस पायाभूत सुविधा" : "Campus Infrastructure"}</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {facilitiesList.map((facility, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* 4. OFFICIAL CONTACT & LOCATION DIRECTORY */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                {isMarathi ? "अधिकृत निर्देशिका" : "Official Directory"}
              </span>
              <div className="w-12 h-0.5 bg-emerald-900"></div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">
              {isMarathi ? "कॅम्पस संपर्क व पत्ता" : "Campus Contact & Postal Coordinates"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Postal Address */}
              <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl">
                <MapPin size={20} className="text-amber-600 shrink-0 mt-1" />
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {isMarathi ? "कॅम्पस पत्ता" : "Campus Address"}
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {address}
                  </p>
                </div>
              </div>

              {/* Telephones */}
              <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl">
                <Phone size={20} className="text-emerald-700 shrink-0 mt-1" />
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {isMarathi ? "दूरध्वनी क्रमांक" : "Phone Numbers"}
                  </span>
                  <div className="space-y-1">
                    {fallbackInst?.phones.map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone}`}
                        className="text-sm font-bold text-emerald-950 hover:text-amber-600 block transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl">
                <Mail size={20} className="text-blue-600 shrink-0 mt-1" />
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {isMarathi ? "अधिकृत ईमेल" : "Official Email"}
                  </span>
                  <div className="space-y-1 truncate">
                    {fallbackInst?.emails.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        className="text-xs sm:text-sm font-medium text-emerald-950 hover:text-amber-600 block truncate transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. EXPLORE OTHER INSTITUTIONS IN THE MANDAL NETWORK */}
        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs block mb-1">
                {isMarathi ? "सर्वोदय शिक्षण मंडळ संस्था संकुल" : "Sarvodaya Shikshan Mandal Network"}
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">
                {isMarathi ? "आमच्या इतर ११ शैक्षणिक संस्था" : "Explore Our Other Institutions (11 Academic Institutions)"}
              </h3>
            </div>
            <Link
              to="/institutions"
              className="text-xs font-bold text-emerald-900 hover:text-amber-600 flex items-center gap-1 uppercase tracking-wider"
            >
              {isMarathi ? "सर्व निर्देशिका" : "All Directory"} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherInstitutions.slice(0, 6).map((other) => (
              <Link
                key={other.id}
                to={`/institution/${other.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group bg-white rounded-xl border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={other.imageUrl}
                    alt={isMarathi ? other.nameMarathi : other.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-emerald-950/90 text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow">
                      {isMarathi ? (other.category === "College" ? "महाविद्यालय" : "शाळा व कनिष्ठ महाविद्यालय") : other.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 group-hover:text-emerald-950 text-base mb-3 line-clamp-1">
                      {isMarathi ? other.nameMarathi : other.nameEnglish}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                      <GraduationCap size={13} className="text-amber-600 shrink-0" />
                      <span className="truncate">
                        {isMarathi
                          ? `${other.headDesignationMarathi}: ${other.headNameMarathi}`
                          : `${other.headDesignationEnglish}: ${other.headNameEnglish}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 group-hover:text-amber-600 pt-3 border-t border-slate-100 mt-2">
                    <span>{isMarathi ? "संस्थेची माहिती पहा" : "View Institution Page"}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* High-Resolution Portrait Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-xl w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full border border-white/20 transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>
              <div className="max-h-[75vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full max-h-[75vh] object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <h4 className="text-xl font-serif font-bold text-white mb-1">
                  {selectedPhoto.title}
                </h4>
                <p className="text-amber-400 text-xs font-medium tracking-wide">
                  {selectedPhoto.subtitle}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
