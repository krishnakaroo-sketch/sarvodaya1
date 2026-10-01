import React, { useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  MapPin,
  Award,
  Users,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Building,
  Maximize2,
  X,
  Crown,
  Quote,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  EXECUTIVE_COMMITTEE,
  MANDAL_REGISTRATION,
  ExecutiveMember,
} from "../data/mandalData";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  content?: Record<string, string>;
}

export const ExecutiveCommitteeSection: React.FC<Props> = ({ content = {} }) => {
  const { language, isMarathi, t } = useLanguage();
  
  let activeCommittee = EXECUTIVE_COMMITTEE;
  if (content['Custom_BoardOfDirectors']) {
    try {
      activeCommittee = JSON.parse(content['Custom_BoardOfDirectors']);
    } catch(e) { console.error(e); }
  }

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "office_bearers" | "members">("all");
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    name: string;
    title: string;
  } | null>(null);

  const getMemberPhoto = (member: ExecutiveMember): string => {
    // Specific role keys from content blocks take priority
    if (member.srNo === 1 && (content["President_Image"] || content["Leader1_Image"])) {
      return content["President_Image"] || content["Leader1_Image"];
    }
    if (member.srNo === 2 && (content["WorkingPresident_Image"] || content["Leader2_Image"])) {
      return content["WorkingPresident_Image"] || content["Leader2_Image"];
    }
    if (member.srNo === 3 && (content["VicePresident1_Image"] || content["Leader3_Image"])) {
      return content["VicePresident1_Image"] || content["Leader3_Image"];
    }
    if (member.srNo === 4 && (content["VicePresident2_Image"] || content["Leader4_Image"])) {
      return content["VicePresident2_Image"] || content["Leader4_Image"];
    }
    if (member.srNo === 5 && (content["Secretary_Image"] || content["Leader5_Image"])) {
      return content["Secretary_Image"] || content["Leader5_Image"];
    }

    // Generic leader / member image keys
    const customPhoto =
      content[`Leader${member.srNo}_Image`] ||
      content[`Member${member.srNo}_Image`] ||
      content[`Member${member.srNo}_Photo`];

    if (customPhoto) return customPhoto;

    return member.imageUrl || "";
  };

  const getMemberMessageLink = (srNo: number): string | null => {
    if (srNo === 1) return "/president-message";
    if (srNo === 2) return "/working-president-message";
    if (srNo === 3 || srNo === 4) return "/vice-president-message";
    if (srNo === 5) return "/secretary-message";
    if (srNo === 6) return "/joint-secretary-message";
    if (srNo === 7) return "/treasurer-message";
    return null;
  };

  const filteredMembers = activeCommittee.filter((member) => {
    const matchesSearch =
      member.nameMarathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designationMarathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designationEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.addressMarathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phones.some((p) => p.includes(searchTerm));

    if (!matchesSearch) return false;

    if (filterRole === "office_bearers") {
      return member.roleBadge !== 'member';
    }
    if (filterRole === "members") {
      return member.roleBadge === 'member';
    }
    return true;
  });

  // Group members into designation tiers
  const presidentMember = filteredMembers.find((m) => m.roleBadge === 'president' || m.srNo === 1);
  const officeBearers = filteredMembers.filter((m) => m !== presidentMember && m.roleBadge !== 'member');
  const executiveMembers = filteredMembers.filter((m) => m.roleBadge === 'member' && m !== presidentMember);

  const getRoleBadgeColor = (role: ExecutiveMember["roleBadge"]) => {
    switch (role) {
      case "president":
        return "bg-amber-400 text-emerald-950 border-amber-300 font-black";
      case "working_president":
        return "bg-emerald-800 text-amber-300 border-emerald-700 font-bold";
      case "vice_president":
        return "bg-emerald-900 text-emerald-100 border-emerald-800 font-bold";
      case "secretary":
        return "bg-amber-600 text-white border-amber-500 font-bold";
      case "joint_secretary":
        return "bg-slate-800 text-slate-100 border-slate-700 font-bold";
      case "treasurer":
        return "bg-emerald-950 text-amber-400 border-emerald-800 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 font-semibold";
    }
  };

  const bannerImage = content["BoardOfDirectors_Banner"] || content["Management_Banner_Image"];

  return (
    <section id="management" className="py-12 md:py-20 bg-slate-50 relative">
      {/* Background ambient texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Optional Header Banner Image if configured */}
        {bannerImage && (
          <div className="relative rounded-3xl overflow-hidden mb-12 shadow-xl border border-emerald-900/20 max-h-80">
            <ImageWithFallback
              src={bannerImage}
              alt="Board of Directors Banner"
              className="w-full h-56 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/50 to-transparent flex items-end p-6 md:p-10">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
                  {isMarathi ? MANDAL_REGISTRATION.nameMarathi : MANDAL_REGISTRATION.nameEnglish}
                </span>
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-white">
                  {content[isMarathi ? "Leadership_Title_Mr" : "Leadership_Title_En"] ||
                    (isMarathi && content["Leadership_Title"] ? content["Leadership_Title"] : null) ||
                    (isMarathi ? "कार्यकारिणी मंडळ" : "Board of Directors")}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Mandal Registration & Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/10 text-emerald-900 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-900/15">
            <ShieldCheck size={15} className="text-amber-600" />
            <span>
              {isMarathi
                ? `${MANDAL_REGISTRATION.regLabelMarathi} • नोंदणी क्र. ${MANDAL_REGISTRATION.regNo}`
                : `Public Trust Reg. No. ${MANDAL_REGISTRATION.regNo}`}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif text-emerald-950 tracking-tight mb-3">
            {content[isMarathi ? "Leadership_Title_Mr" : "Leadership_Title_En"] ||
              (isMarathi && content["Leadership_Title"] ? content["Leadership_Title"] : null) ||
              (isMarathi ? "कार्यकारिणी पदाधिकारी व सदस्य" : "Board of Directors & Executive Members")}
          </h2>
          <p className="text-slate-600 font-serif text-base md:text-lg">
            {isMarathi
              ? `नियामक मंडळ व कार्यकारणी समिती — ${MANDAL_REGISTRATION.nameMarathi}`
              : `Board of Directors & Executive Committee — ${MANDAL_REGISTRATION.nameEnglish}`}
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <button
              onClick={() => setFilterRole("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterRole === "all"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi
                ? `सर्व सदस्य (${activeCommittee.length})`
                : `All Members (${activeCommittee.length})`}
            </button>
            <button
              onClick={() => setFilterRole("office_bearers")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterRole === "office_bearers"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi ? "प्रमुख पदाधिकारी (७)" : "Office Bearers (7)"}
            </button>
            <button
              onClick={() => setFilterRole("members")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterRole === "members"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi ? "कार्यकारिणी सदस्य (४)" : "Executive Members (4)"}
            </button>
          </div>

          {/* Search Input & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 md:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isMarathi
                    ? "नाव किंवा पद शोधा..."
                    : "Search by name or designation..."
                }
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-900/20 text-slate-800"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-emerald-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title={isMarathi ? "कार्ड दृश्य" : "Card View"}
              >
                {isMarathi ? "कार्ड" : "Cards"}
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-emerald-950 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title={isMarathi ? "तालिका दृश्य" : "Table View"}
              >
                {isMarathi ? "तालिका" : "Table"}
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Hierarchical Card View (3 Lines as Requested) */}
        {viewMode === "cards" && (
          <div className="space-y-14 md:space-y-20">
            {/* =========================================================
                LINE 1: PRESIDENT (अध्यक्ष) - STUNNING CENTERPIECE VIEW
               ========================================================= */}
            {presidentMember && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Line 1 Header Label */}
                <div className="flex items-center justify-center gap-3 mb-6 text-center">
                  <div className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-amber-500" />
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 font-extrabold text-xs uppercase tracking-widest shadow-xs">
                    <Crown size={15} className="text-amber-600" /> {isMarathi ? "संस्था अध्यक्ष" : "Mandal President"}
                  </span>
                  <div className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-amber-500" />
                </div>

                {/* Grand Presidential Card */}
                {(() => {
                  const presPhoto = getMemberPhoto(presidentMember);
                  return (
                    <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl border-2 border-amber-400/40 shadow-2xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
                      {/* Decorative ambient background flares */}
                      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-800/20 blur-3xl pointer-events-none" />
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-400 pointer-events-none">
                        <Crown size={220} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                        {/* Left Column: Extra Large Presidential Portrait */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                          <div
                            onClick={() =>
                              presPhoto &&
                              setSelectedPhoto({
                                url: presPhoto,
                                name: isMarathi ? presidentMember.nameMarathi : presidentMember.nameEnglish,
                                title: isMarathi ? presidentMember.designationMarathi : presidentMember.designationEnglish,
                              })
                            }
                            className="relative group/pres cursor-pointer w-full max-w-[340px] md:max-w-[360px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-400/80 bg-emerald-950"
                            title={isMarathi ? "मोठ्या आकारात पाहण्यासाठी क्लिक करा" : "Click to view full portrait"}
                          >
                            {presPhoto ? (
                              <ImageWithFallback
                                src={presPhoto}
                                alt={isMarathi ? presidentMember.nameMarathi : presidentMember.nameEnglish}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/pres:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-serif font-bold text-5xl">
                                {(isMarathi ? presidentMember.nameMarathi : presidentMember.nameEnglish).slice(0, 2)}
                              </div>
                            )}

                            {/* Gradient Overlay & Hover Zoom Indicator */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover/pres:opacity-100 transition-opacity flex items-center justify-center gap-2 text-amber-300 font-bold text-xs">
                              <div className="bg-emerald-950/90 px-4 py-2 rounded-xl border border-amber-400/60 shadow-lg flex items-center gap-2">
                                <Maximize2 size={16} /> {isMarathi ? "मोठा फोटो पहा" : "View Full Size"}
                              </div>
                            </div>

                            {/* Top Left Sr No Badge */}
                            <div className="absolute top-3 left-3 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                              <span>#1</span>
                            </div>
                          </div>

                          <span className="text-[11px] text-emerald-200/75 mt-3 font-medium flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-400" />
                            {isMarathi ? "फोटोवर क्लिक करून मोठा आकार पहा" : "Click portrait to expand view"}
                          </span>
                        </div>

                        {/* Right Column: Presidential Identity & Credentials */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div>
                            {/* Role Badge */}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider shadow-md">
                                <Crown size={14} /> {isMarathi ? presidentMember.designationMarathi : presidentMember.designationEnglish}
                              </span>
                              <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-emerald-100 font-medium border border-white/15">
                                {isMarathi ? "सर्वोच्च नेतृत्व" : "Supreme Leadership"}
                              </span>
                            </div>

                            {/* Names */}
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mb-6 leading-tight">
                              {isMarathi ? presidentMember.nameMarathi : presidentMember.nameEnglish}
                            </h3>

                            {/* Ornate Gold Divider */}
                            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-6" />

                            {/* Leadership Vision Quote */}
                            <div className="relative bg-white/5 border-l-4 border-amber-400 p-5 rounded-r-2xl mb-6 shadow-inner backdrop-blur-xs">
                              <Quote size={28} className="text-amber-400/30 absolute top-3 right-3" />
                              <p className="font-serif text-sm sm:text-base text-emerald-50 leading-relaxed italic">
                                {isMarathi
                                  ? "\"ग्रामीण व दुर्गम भागातील विद्यार्थ्यांना उच्च व गुणवत्तापूर्ण शिक्षण देऊन त्यांना सक्षम, स्वावलंबी व राष्ट्रउभारणीत योगदान देणारे नागरिक घडविणे हेच सर्वोदय शिक्षण मंडळाचे आद्य ध्येय आहे.\""
                                  : "\"To provide high quality, accessible higher education to students from rural and developing regions of Central India, transforming them into capable, self-reliant nation builders.\""}
                              </p>
                            </div>

                            {/* Address Box */}
                            <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-xs text-emerald-100 leading-relaxed">
                              <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-300 block mb-0.5">
                                  {isMarathi ? "निवास व कार्यालय पत्ता:" : "Official Address:"}
                                </span>
                                <span>{isMarathi ? presidentMember.addressMarathi : presidentMember.addressEnglish}</span>
                              </div>
                            </div>
                          </div>

                          {/* Contact & Message Action Buttons */}
                          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                            {presidentMember.phones.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-xl text-xs transition-colors shadow-md"
                              >
                                <Phone size={14} />
                                <span>{isMarathi ? "संपर्क: " : "Call: "}{phone}</span>
                              </a>
                            ))}

                            <a
                              href="/president-message"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/25 transition-all shadow-sm group"
                            >
                              <span>{isMarathi ? "अध्यक्षांचे मनोगत वाचा" : "Read President's Message"}</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* =========================================================
                LINE 2: REST OF OFFICE BEARERS (प्रमुख पदाधिकारी - SR 2 TO 7)
               ========================================================= */}
            {officeBearers.length > 0 && (
              <div>
                {/* Line 2 Section Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pt-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
                      <Users size={14} className="text-emerald-800" />
                      {isMarathi ? "प्रमुख पदाधिकारी" : "Office Bearers"}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950">
                      {isMarathi
                        ? "कार्यकारी अध्यक्ष, उपाध्यक्ष, सचिव, सहसचिव व कोषाध्यक्ष"
                        : "Working President, Vice Presidents, Secretary, Joint Secretary & Treasurer"}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      {isMarathi
                        ? "नियामक मंडळ व मुख्य पदाधिकारी (अ.क्र. २ ते ७)"
                        : "Governing Council & Key Executive Officers (Sr. No. 2 to 7)"}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    {officeBearers.length} {isMarathi ? "पदाधिकारी" : "Office Bearers"}
                  </div>
                </div>

                {/* Office Bearers Grid with Large Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {officeBearers.map((member) => {
                    const photo = getMemberPhoto(member);
                    const msgLink = getMemberMessageLink(member.srNo);

                    return (
                      <motion.div
                        key={member.srNo}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/60 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group/card"
                      >
                        <div>
                          {/* Large Portrait Photo Frame */}
                          <div
                            onClick={() =>
                              photo &&
                              setSelectedPhoto({
                                url: photo,
                                name: isMarathi ? member.nameMarathi : member.nameEnglish,
                                title: isMarathi ? member.designationMarathi : member.designationEnglish,
                              })
                            }
                            className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900 cursor-pointer"
                            title={isMarathi ? "मोठा फोटो पाहण्यासाठी क्लिक करा" : "Click to view full photo"}
                          >
                            {photo ? (
                              <ImageWithFallback
                                src={photo}
                                alt={isMarathi ? member.nameMarathi : member.nameEnglish}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-serif font-bold text-4xl bg-emerald-950">
                                {(isMarathi ? member.nameMarathi : member.nameEnglish).slice(0, 2)}
                              </div>
                            )}

                            {/* Gradient Overlay for bottom text legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent pointer-events-none" />

                            {/* Top Left Sr No Badge */}
                            <div className="absolute top-3 left-3 bg-emerald-950 text-amber-400 font-bold text-xs w-7 h-7 rounded-full flex items-center justify-center border border-amber-400/50 shadow-md">
                              #{member.srNo}
                            </div>

                            {/* Top Right Designation Pill */}
                            <div className="absolute top-3 right-3">
                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-md ${getRoleBadgeColor(
                                  member.roleBadge
                                )}`}
                              >
                                {isMarathi ? member.designationMarathi : member.designationEnglish}
                              </span>
                            </div>

                            {/* Floating Photo Name Banner */}
                            <div className="absolute bottom-3 inset-x-4">
                              <h4 className="text-lg font-serif font-bold text-white drop-shadow-sm leading-tight">
                                {isMarathi ? member.nameMarathi : member.nameEnglish}
                              </h4>
                            </div>

                            {/* Hover Full Screen Indicator */}
                            <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2 text-amber-300 text-xs font-bold">
                              <div className="bg-emerald-950/90 px-3 py-1.5 rounded-lg border border-amber-400/60 shadow-lg flex items-center gap-1.5">
                                <Maximize2 size={14} /> {isMarathi ? "मोठा फोटो पहा" : "View Photo"}
                              </div>
                            </div>
                          </div>

                          {/* Card Body Details */}
                          <div className="p-5">
                            {/* Designation Sub-label */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                {isMarathi ? member.designationMarathi : member.designationEnglish}
                              </span>
                            </div>

                            {/* Address Box */}
                            <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                              <MapPin size={15} className="text-amber-600 shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <span className="font-bold text-slate-700 block mb-0.5">
                                  {isMarathi ? "पत्ता:" : "Address:"}
                                </span>
                                <span>{isMarathi ? member.addressMarathi : member.addressEnglish}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Phone Numbers & Message Link */}
                        <div className="p-5 pt-0 border-t border-slate-100 mt-auto flex flex-col gap-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2 pt-3">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              {isMarathi ? "मोबाईल:" : "Mobile:"}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {member.phones.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phone}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                                >
                                  <Phone size={12} className="text-emerald-700" />
                                  <span>{phone}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {msgLink && (
                            <a
                              href={msgLink}
                              className="w-full inline-flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-emerald-900 hover:text-white text-emerald-950 font-bold text-xs rounded-lg transition-colors border border-slate-200 group"
                            >
                              <span>{isMarathi ? "संदेश वाचा" : "Read Message"}</span>
                              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =========================================================
                LINE 3: EXECUTIVE MEMBERS (कार्यकारिणी सदस्य - SR 8 TO 11)
               ========================================================= */}
            {executiveMembers.length > 0 && (
              <div>
                {/* Line 3 Section Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pt-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">
                      <Users size={14} className="text-slate-700" />
                      {isMarathi ? "कार्यकारिणी सदस्य" : "Executive Members"}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-emerald-950">
                      {isMarathi
                        ? "कार्यकारिणी सदस्य"
                        : "Executive Committee Members"}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      {isMarathi
                        ? "मान्यवर विश्वस्त व सदस्य (अ.क्र. ८ ते ११)"
                        : "Distinguished Board Trustees & Executive Members (Sr. No. 8 to 11)"}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    {executiveMembers.length} {isMarathi ? "सदस्य" : "Members"}
                  </div>
                </div>

                {/* 4-Column Grid with Large Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {executiveMembers.map((member) => {
                    const photo = getMemberPhoto(member);

                    return (
                      <motion.div
                        key={member.srNo}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group/card"
                      >
                        <div>
                          {/* Large Portrait Photo Frame */}
                          <div
                            onClick={() =>
                              photo &&
                              setSelectedPhoto({
                                url: photo,
                                name: isMarathi ? member.nameMarathi : member.nameEnglish,
                                title: isMarathi ? member.designationMarathi : member.designationEnglish,
                              })
                            }
                            className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer"
                            title={isMarathi ? "मोठा फोटो पाहण्यासाठी क्लिक करा" : "Click to view full photo"}
                          >
                            {photo ? (
                              <ImageWithFallback
                                src={photo}
                                alt={isMarathi ? member.nameMarathi : member.nameEnglish}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-amber-300 font-serif font-bold text-3xl bg-emerald-950">
                                {(isMarathi ? member.nameMarathi : member.nameEnglish).slice(0, 2)}
                              </div>
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/15 to-transparent pointer-events-none" />

                            {/* Top Left Sr No Badge */}
                            <div className="absolute top-3 left-3 bg-emerald-950 text-amber-400 font-bold text-xs w-7 h-7 rounded-full flex items-center justify-center border border-amber-400/50 shadow-md">
                              #{member.srNo}
                            </div>

                            {/* Top Right Role Pill */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white border border-white/20 shadow-sm backdrop-blur-xs">
                                {isMarathi ? "सदस्य" : "Member"}
                              </span>
                            </div>

                            {/* Bottom Name Banner */}
                            <div className="absolute bottom-3 inset-x-3.5">
                              <h4 className="text-base font-serif font-bold text-white drop-shadow-sm leading-tight">
                                {isMarathi ? member.nameMarathi : member.nameEnglish}
                              </h4>
                            </div>

                            {/* Hover Full Screen Indicator */}
                            <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center text-amber-300 text-xs font-bold">
                              <div className="bg-emerald-950/90 px-3 py-1.5 rounded-lg border border-amber-400/60 shadow-lg flex items-center gap-1.5">
                                <Maximize2 size={13} /> {isMarathi ? "फोटो पहा" : "View Photo"}
                              </div>
                            </div>
                          </div>

                          {/* Card Body Details */}
                          <div className="p-4">
                            <span className="inline-block text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mb-3">
                              {isMarathi ? member.designationMarathi : member.designationEnglish}
                            </span>

                            {/* Address Box */}
                            <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                              <MapPin size={13} className="text-amber-600 shrink-0 mt-0.5" />
                              <div className="line-clamp-3">
                                <span>{isMarathi ? member.addressMarathi : member.addressEnglish}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Contact Phone */}
                        <div className="p-4 pt-0 border-t border-slate-100 mt-auto">
                          <div className="pt-2.5 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              {isMarathi ? "मोबाईल:" : "Mobile:"}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {member.phones.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phone}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-md text-[11px] font-bold transition-colors"
                                >
                                  <Phone size={11} className="text-emerald-700" />
                                  <span>{phone}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty Search / Filter Result */}
            {filteredMembers.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
                <Users size={40} className="text-slate-300 mx-auto mb-3" />
                <h4 className="text-lg font-serif font-bold text-slate-800 mb-1">
                  {isMarathi ? "कोणतेही सदस्य सापडले नाहीत" : "No Members Found"}
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  {isMarathi
                    ? `"${searchTerm}" साठी कोणतेही परिणाम उपलब्ध नाहीत. कृपया दुसरे नाव किंवा पद शोधा.`
                    : `No results matching "${searchTerm}". Please try a different name or role.`}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                  }}
                  className="px-4 py-2 bg-emerald-950 text-amber-300 font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-900 transition-colors"
                >
                  {isMarathi ? "सर्व सदस्य पहा" : "View All Members (Reset Filters)"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* View 2: Official Trust Register Table */}
        {viewMode === "table" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900">
              <div>
                <h4 className="font-serif font-bold text-base md:text-lg text-amber-300">
                  {isMarathi ? MANDAL_REGISTRATION.nameMarathi : MANDAL_REGISTRATION.nameEnglish}
                </h4>
                <p className="text-xs text-emerald-200">
                  {isMarathi
                    ? `${MANDAL_REGISTRATION.regLabelMarathi} • अधिकृत कार्यकारणी पदाधिकारी व सदस्य सूची`
                    : `Trust Reg. No. ${MANDAL_REGISTRATION.regNo} • Official Board of Directors & Committee Register`}
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded bg-white/10 text-slate-200 font-mono self-start sm:self-auto">
                {isMarathi ? `एकूण सदस्य: ${filteredMembers.length}` : `Total Members: ${filteredMembers.length}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-emerald-950 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3 w-12 text-center">{isMarathi ? "अ.क्र." : "Sr. No."}</th>
                    <th className="py-3 px-3 w-20 text-center">{isMarathi ? "फोटो" : "Photo"}</th>
                    <th className="py-3 px-4 w-44">{isMarathi ? "पद" : "Designation"}</th>
                    <th className="py-3 px-4 w-56">{isMarathi ? "नाव" : "Name"}</th>
                    <th className="py-3 px-4">{isMarathi ? "पत्ता" : "Address"}</th>
                    <th className="py-3 px-4 w-44 text-right">{isMarathi ? "मोबाईल नंबर" : "Contact (Mobile)"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filteredMembers.map((member) => {
                    const photo = getMemberPhoto(member);
                    return (
                      <tr
                        key={member.srNo}
                        className={`hover:bg-emerald-50/40 transition-colors ${
                          member.srNo === 1 ? "bg-amber-50/40 font-medium" : ""
                        }`}
                      >
                        <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                          {member.srNo === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-emerald-950 text-xs font-black">
                              1
                            </span>
                          ) : (
                            member.srNo
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              photo &&
                              setSelectedPhoto({
                                url: photo,
                                name: isMarathi ? member.nameMarathi : member.nameEnglish,
                                title: isMarathi ? member.designationMarathi : member.designationEnglish,
                              })
                            }
                            className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 bg-slate-100 inline-flex items-center justify-center hover:scale-110 transition-transform shadow-xs cursor-pointer"
                            title={isMarathi ? "फोटो मोठा पहा" : "Click to view photo"}
                          >
                            {photo ? (
                              <ImageWithFallback
                                src={photo}
                                alt={isMarathi ? member.nameMarathi : member.nameEnglish}
                                className="w-full h-full object-cover object-top"
                              />
                            ) : (
                              <span className="text-xs font-bold text-emerald-900">
                                {(isMarathi ? member.nameMarathi : member.nameEnglish).slice(0, 2)}
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold border ${getRoleBadgeColor(
                              member.roleBadge
                            )}`}
                          >
                            {isMarathi ? member.designationMarathi : member.designationEnglish}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-serif font-bold text-emerald-950 text-sm block">
                            {isMarathi ? member.nameMarathi : member.nameEnglish}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs leading-relaxed text-slate-600">
                          {isMarathi ? member.addressMarathi : member.addressEnglish}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            {member.phones.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-amber-600 hover:underline"
                              >
                                <Phone size={11} />
                                <span>{phone}</span>
                              </a>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
              {isMarathi
                ? `${MANDAL_REGISTRATION.nameMarathi} • नोंदणी क्रमांक: ${MANDAL_REGISTRATION.regNo} • अधिकृत नोंदणीकृत विश्वस्त मंडळ`
                : `${MANDAL_REGISTRATION.nameEnglish} • Trust Reg. No: ${MANDAL_REGISTRATION.regNo} • Official Registered Board of Trustees`}
            </div>
          </div>
        )}

        {/* Modal: Full-screen Photo Lightbox Viewer */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-xl w-full border border-white/20"
              >
                <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-slate-950">
                  <ImageWithFallback
                    src={selectedPhoto.url}
                    alt={selectedPhoto.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
                    title={isMarathi ? "बंद करा" : "Close"}
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent p-6 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider mb-2">
                      {selectedPhoto.title}
                    </span>
                    <h4 className="text-2xl font-serif font-bold text-white mb-0.5">
                      {selectedPhoto.name}
                    </h4>
                    <p className="text-xs text-emerald-200">
                      {isMarathi
                        ? "सर्वोदय शिक्षण मंडळ, चंद्रपूर • अधिकृत पदाधिकारी छायाचित्र"
                        : "Sarvodaya Shikshan Mandal, Chandrapur • Official Member Portrait"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

