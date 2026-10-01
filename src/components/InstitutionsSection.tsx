import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  GraduationCap,
  School,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ArrowRight,
  Search,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { MANDAL_INSTITUTIONS, InstitutionContact, MANDAL_REGISTRATION } from "../data/mandalData";
import { useLanguage } from "../context/LanguageContext";

interface Props {
  content?: Record<string, string>;
  institutions?: any[];
}

export const InstitutionsSection: React.FC<Props> = ({ content = {}, institutions = [] }) => {
  const [activeTab, setActiveTab] = useState<"all" | "colleges" | "schools" | "directory">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isMarathi, t } = useLanguage();

  // Merge any backend institutions if they have extra data, defaulting to MANDAL_INSTITUTIONS
  const allInstitutions: InstitutionContact[] = MANDAL_INSTITUTIONS.map((defInst) => {
    const backendMatch = institutions.find(
      (b) => String(b.id) === String(defInst.id) || b.name?.toLowerCase().includes(defInst.nameEnglish.toLowerCase())
    );
    if (backendMatch) {
      return {
        ...defInst,
        imageUrl: backendMatch.imageUrl || defInst.imageUrl,
        link: backendMatch.link || defInst.link,
      };
    }
    return defInst;
  });

  const filteredInstitutions = allInstitutions.filter((inst) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      inst.nameMarathi.toLowerCase().includes(query) ||
      inst.nameEnglish.toLowerCase().includes(query) ||
      inst.headNameMarathi.toLowerCase().includes(query) ||
      inst.headNameEnglish.toLowerCase().includes(query) ||
      inst.talukaDistrictMarathi.toLowerCase().includes(query) ||
      inst.talukaDistrictEnglish.toLowerCase().includes(query) ||
      inst.emails.some((e) => e.toLowerCase().includes(query)) ||
      inst.phones.some((p) => p.includes(query));

    if (!matchesSearch) return false;

    if (activeTab === "colleges") {
      return inst.category === "College";
    }
    if (activeTab === "schools") {
      return inst.category === "School & Junior College";
    }
    return true;
  });

  return (
    <section id="institutions" className="py-12 md:py-16 bg-slate-50 border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-emerald-900 font-bold uppercase tracking-[0.2em] text-xs">
                {isMarathi
                  ? `${MANDAL_REGISTRATION.nameMarathi} • ${MANDAL_REGISTRATION.regLabelMarathi}`
                  : `${MANDAL_REGISTRATION.nameEnglish} • Trust Reg. No. ${MANDAL_REGISTRATION.regNo}`}
              </span>
              <div className="w-16 h-px bg-slate-300"></div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-emerald-950 leading-tight">
              {content[isMarathi ? "Institutions_Title_Mr" : "Institutions_Title_En"] ||
                (isMarathi && content["Institutions_Title"] ? content["Institutions_Title"] : null) ||
                (isMarathi ? "आमच्या शिक्षण संस्था" : "Our Educational Institutions")}
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-2 font-serif">
              {isMarathi
                ? "सर्वोदय शिक्षण मंडळ द्वारा संचालित शाळा, उच्च व व्यावसायिक महाविद्यालये"
                : "Schools, senior degree colleges, and higher secondary institutions under Sarvodaya Shikshan Mandal"}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-100/60 px-4 py-2 rounded-lg border border-emerald-200 self-start md:self-auto">
            <GraduationCap size={16} className="text-amber-600" />
            <span>{isMarathi ? "एकूण ११ शैक्षणिक संस्था" : "Total 11 Educational Institutions"}</span>
          </div>
        </div>

        {/* Tab & Search Control Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi ? "सर्व संस्था (११)" : "All Institutions (11)"}
            </button>
            <button
              onClick={() => setActiveTab("colleges")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "colleges"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi ? "महाविद्यालये (५)" : "Colleges (5)"}
            </button>
            <button
              onClick={() => setActiveTab("schools")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "schools"
                  ? "bg-emerald-950 text-amber-400 shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {isMarathi ? "शाळा व कनिष्ठ महाविद्यालये (६)" : "Schools & Jr Colleges (6)"}
            </button>
            <button
              onClick={() => setActiveTab("directory")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "directory"
                  ? "bg-amber-500 text-emerald-950 shadow-sm"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
              }`}
            >
              {isMarathi ? "प्राचार्य / मुख्याध्यापक सूची" : "Official Directory of Heads"}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMarathi ? "शाळा/महाविद्यालय किंवा प्राचार्य शोधा..." : "Search institution or principal..."}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-900/20 text-slate-800"
            />
          </div>
        </div>

        {/* View 1: Card Grid (When activeTab is 'all', 'colleges', or 'schools') */}
        {activeTab !== "directory" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredInstitutions.map((inst) => (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Badges */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={inst.imageUrl}
                    alt={isMarathi ? inst.nameMarathi : inst.nameEnglish}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-white/95 backdrop-blur px-3 py-1 text-[11px] font-bold text-emerald-950 rounded-md shadow-sm border border-slate-200">
                      {isMarathi
                        ? (inst.category === "College" ? "वरिष्ठ महाविद्यालय" : "शाळा व कनिष्ठ महाविद्यालय")
                        : inst.category}
                    </span>
                    <span className="bg-amber-500 text-emerald-950 px-3 py-1 text-[11px] font-bold rounded-md shadow-sm">
                      #{inst.id}
                    </span>
                  </div>

                  {/* Location Pin Bottom-Left */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                    <MapPin size={14} className="text-amber-400" />
                    <span>{isMarathi ? inst.talukaDistrictMarathi : inst.talukaDistrictEnglish}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 md:p-7 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-1 leading-snug group-hover:text-emerald-800 transition-colors">
                    {isMarathi ? inst.nameMarathi : inst.nameEnglish}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 text-justify">
                    {inst.description}
                  </p>

                  {/* Principal / Headmaster Info Box */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3.5 mb-5 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <GraduationCap size={15} className="text-emerald-700" />
                        <span>
                          {isMarathi
                            ? `${inst.headDesignationMarathi}: ${inst.headNameMarathi}`
                            : `${inst.headDesignationEnglish}: ${inst.headNameEnglish}`}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-emerald-100/80 flex-wrap text-slate-700">
                      {inst.phones.map((phone, pIdx) => (
                        <a
                          key={pIdx}
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1 hover:text-emerald-900 font-bold"
                        >
                          <Phone size={12} className="text-amber-600" />
                          <span>{phone}</span>
                        </a>
                      ))}
                      {inst.emails.map((email, eIdx) => (
                        <a
                          key={eIdx}
                          href={`mailto:${email}`}
                          className="inline-flex items-center gap-1 hover:text-emerald-900 font-medium truncate max-w-[240px]"
                        >
                          <Mail size={12} className="text-amber-600 shrink-0" />
                          <span className="truncate">{email}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100">
                    <a
                      href={`/institution/${inst.id}`}
                      className="inline-flex items-center gap-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider hover:text-amber-600 transition-colors"
                    >
                      {isMarathi ? "सविस्तर माहिती पहा" : "Learn More"} <ArrowRight size={14} />
                    </a>
                    {inst.link && inst.link !== "#" && (
                      <a
                        href={inst.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-900 transition-colors"
                      >
                        {isMarathi ? "अधिकृत संकेतस्थळ" : "Visit Website"} <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View 2: Official Principals & Headmasters Directory Table (Matching Page 1 of Mandal document) */}
        {activeTab === "directory" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 bg-emerald-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-900">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-amber-400" />
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-300">
                    {isMarathi ? MANDAL_REGISTRATION.regLabelMarathi : `Trust Reg. No. ${MANDAL_REGISTRATION.regNo}`}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-white">
                  {isMarathi
                    ? "सर्वोदय शिक्षण मंडळ द्वारा संचालित शाळा व महाविद्यालयातील प्राचार्य आणि मुख्याध्यापकांचे संपर्क निर्देशिका"
                    : "Administrative Directory of Principals and Headmasters of Mandal Institutions"}
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {isMarathi
                    ? "अधिकृत प्रशासकीय व संपर्क यादी"
                    : "Official Institutional Leadership Directory"}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-white/10 rounded text-xs font-mono text-slate-200">
                  {isMarathi ? `एकूण संस्था: ${filteredInstitutions.length}` : `Total: ${filteredInstitutions.length}`}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-emerald-950 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">{isMarathi ? "अ.क्र." : "Sr. No."}</th>
                    <th className="py-3 px-4 w-72">{isMarathi ? "शाळा / महाविद्यालयाचे नाव" : "Institution Name"}</th>
                    <th className="py-3 px-4 w-28">{isMarathi ? "पद" : "Designation"}</th>
                    <th className="py-3 px-4 w-48">{isMarathi ? "प्राचार्य / मुख्याध्यापकांचे नाव" : "Principal / Head Name"}</th>
                    <th className="py-3 px-4 w-60">{isMarathi ? "ई-मेल आयडी" : "Email ID"}</th>
                    <th className="py-3 px-4 w-36">{isMarathi ? "संपर्क क्रमांक" : "Contact Number"}</th>
                    <th className="py-3 px-4 w-28 text-center">{isMarathi ? "कृती" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filteredInstitutions.map((inst) => (
                    <tr
                      key={inst.id}
                      className="hover:bg-emerald-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                        {inst.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-bold text-emerald-950 text-sm block leading-snug">
                          {isMarathi ? inst.nameMarathi : inst.nameEnglish}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {isMarathi ? inst.headDesignationMarathi : inst.headDesignationEnglish}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-900 block text-xs md:text-sm">
                          {isMarathi ? inst.headNameMarathi : inst.headNameEnglish}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {inst.emails.map((email, eIdx) => (
                            <a
                              key={eIdx}
                              href={`mailto:${email}`}
                              className="text-emerald-800 hover:text-amber-600 hover:underline text-xs flex items-center gap-1 truncate"
                              title={email}
                            >
                              <Mail size={11} className="shrink-0 text-slate-400" />
                              <span className="truncate">{email}</span>
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 font-mono font-bold text-xs">
                          {inst.phones.map((phone, pIdx) => (
                            <a
                              key={pIdx}
                              href={`tel:${phone}`}
                              className="text-emerald-900 hover:text-amber-600 flex items-center gap-1"
                            >
                              <Phone size={11} className="text-emerald-700" />
                              <span>{phone}</span>
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/institution/${inst.id}`}
                            title={isMarathi ? "संस्थेची माहिती पहा" : "View Institution Details"}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                          >
                            <ArrowRight size={13} />
                          </a>
                          <a
                            href={`tel:${inst.phones[0]}`}
                            title={`Call ${isMarathi ? inst.headNameMarathi : inst.headNameEnglish}`}
                            className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded transition-colors"
                          >
                            <Phone size={13} />
                          </a>
                          <a
                            href={`mailto:${inst.emails[0]}`}
                            title={`Email ${isMarathi ? inst.headNameMarathi : inst.headNameEnglish}`}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded transition-colors"
                          >
                            <Mail size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <span>
                {isMarathi
                  ? `${MANDAL_REGISTRATION.nameMarathi} • ${MANDAL_REGISTRATION.regLabelMarathi}`
                  : `${MANDAL_REGISTRATION.nameEnglish} • Trust Reg. No. ${MANDAL_REGISTRATION.regNo}`}
              </span>
              <span>
                {isMarathi ? "शाळा व महाविद्यालय अधिकृत संपर्क सूची" : "Official Directory of Institutions"}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

