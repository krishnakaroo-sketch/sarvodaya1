import React, { useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Quote, Phone, MapPin, Target, GraduationCap, ChevronRight, BookOpen, Crown } from "lucide-react";
import { EXECUTIVE_COMMITTEE, ExecutiveMember } from "../data/mandalData";
import { useLanguage } from "../context/LanguageContext";

interface LeadershipMessagesProps {
  content?: Record<string, string>;
  activeMemberId?: number;
  activeLeader?: string; // for backward compatibility with 'all'
}

export const LeadershipMessages: React.FC<LeadershipMessagesProps> = ({ content = {}, activeMemberId, activeLeader }) => {
  const { language, isMarathi, t } = useLanguage();

  let members: ExecutiveMember[] = [...EXECUTIVE_COMMITTEE];
  if (content['Custom_BoardOfDirectors']) {
    try {
      members = JSON.parse(content['Custom_BoardOfDirectors']);
    } catch(e) {}
  }

  // Active member for single message view
  const activeMember = members.find(m => m.srNo === activeMemberId) || members[0];

  const getMemberMessageData = (member: ExecutiveMember) => {
    // We expect generic LeaderN_Message keys now
    const key = `Leader${member.srNo}`;
    
    // Support legacy keys if they exist, else fallback to new dynamic keys
    const legacyNameMr = content[`${member.roleBadge === 'president' ? 'President' : member.roleBadge === 'working_president' ? 'WorkingPresident' : member.roleBadge === 'secretary' ? 'Secretary' : 'Leader'}_Name_Mr`];
    const legacyNameEn = content[`${member.roleBadge === 'president' ? 'President' : member.roleBadge === 'working_president' ? 'WorkingPresident' : member.roleBadge === 'secretary' ? 'Secretary' : 'Leader'}_Name_En`];
    
    // Actually let's keep it simple: always prefer the generic `LeaderN` key, then legacy keys, then member defaults.
    
    // Name
    let finalNameMr = content[`${key}_Name_Mr`] || content[`${key}_Name`] || member.nameMarathi;
    let finalNameEn = content[`${key}_Name_En`] || content[`${key}_Name`] || member.nameEnglish;

    // Title / Designation
    let finalTitleMr = content[`${key}_Title_Mr`] || content[`${key}_Title`] || member.designationMarathi;
    let finalTitleEn = content[`${key}_Title_En`] || content[`${key}_Title`] || member.designationEnglish;
    
    // Quote
    let finalQuoteMr = content[`${key}_Quote_Mr`] || content[`${key}_Quote`] || ``;
    let finalQuoteEn = content[`${key}_Quote_En`] || content[`${key}_Quote`] || ``;

    // Message Body
    let finalMsgMrText = content[`${key}_Text_Mr`] || content[`${key}_Text`] || ``;
    let finalMsgEnText = content[`${key}_Text_En`] || content[`${key}_Text`] || ``;
    
    // Handle backwards compatibility for the first few office bearers explicitly:
    if (member.srNo === 1) {
      finalNameMr = content['President_Name_Mr'] || finalNameMr;
      finalNameEn = content['President_Name_En'] || finalNameEn;
      finalTitleMr = content['President_Title_Mr'] || finalTitleMr;
      finalTitleEn = content['President_Title_En'] || finalTitleEn;
      finalQuoteMr = content['President_Quote_Mr'] || finalQuoteMr || "ज्ञान, शील आणि संस्कारांच्या माध्यमातून सर्वोदयाचे स्वप्न साकार करणे व ग्रामीण-दुर्गम भागातील विद्यार्थ्यांना राष्ट्रउभारणीत अग्रेसर करणे हेच आमचे आद्य कर्तव्य आहे.";
      finalQuoteEn = content['President_Quote_En'] || finalQuoteEn || "To realize the vision of 'Sarvodaya' — the upliftment of all through knowledge, character, and ethical values...";
      finalMsgMrText = content['President_Text_Mr'] || finalMsgMrText;
      finalMsgEnText = content['President_Text_En'] || finalMsgEnText;
    } else if (member.srNo === 2) {
      finalNameMr = content['WorkingPresident_Name_Mr'] || finalNameMr;
      finalNameEn = content['WorkingPresident_Name_En'] || finalNameEn;
      finalTitleMr = content['WorkingPresident_Title_Mr'] || finalTitleMr;
      finalTitleEn = content['WorkingPresident_Title_En'] || finalTitleEn;
      finalQuoteMr = content['WorkingPresident_Quote_Mr'] || finalQuoteMr;
      finalQuoteEn = content['WorkingPresident_Quote_En'] || finalQuoteEn;
      finalMsgMrText = content['WorkingPresident_Text_Mr'] || finalMsgMrText;
      finalMsgEnText = content['WorkingPresident_Text_En'] || finalMsgEnText;
    } else if (member.srNo === 5) {
      finalNameMr = content['Secretary_Name_Mr'] || finalNameMr;
      finalNameEn = content['Secretary_Name_En'] || finalNameEn;
      finalTitleMr = content['Secretary_Title_Mr'] || finalTitleMr;
      finalTitleEn = content['Secretary_Title_En'] || finalTitleEn;
      finalQuoteMr = content['Secretary_Quote_Mr'] || finalQuoteMr;
      finalQuoteEn = content['Secretary_Quote_En'] || finalQuoteEn;
      finalMsgMrText = content['Secretary_Text_Mr'] || finalMsgMrText;
      finalMsgEnText = content['Secretary_Text_En'] || finalMsgEnText;
    }
    
    // Default image check
    let imageUrl = content[`${key}_Image`] || member.imageUrl;
    if (member.srNo === 1) imageUrl = content['President_Image'] || imageUrl;
    if (member.srNo === 2) imageUrl = content['WorkingPresident_Image'] || imageUrl;
    if (member.srNo === 5) imageUrl = content['Secretary_Image'] || imageUrl;
    
    return {
      member,
      finalName: isMarathi ? finalNameMr : finalNameEn,
      finalTitle: isMarathi ? finalTitleMr : finalTitleEn,
      finalQuote: isMarathi ? finalQuoteMr : finalQuoteEn,
      finalMsgLines: (isMarathi ? finalMsgMrText : finalMsgEnText).split('\n').filter(l => l.trim().length > 0),
      imageUrl
    };
  };

  // If viewing all leadership messages
  if (activeLeader === 'all') {
    return (
      <div className="py-8 md:py-16 bg-white min-h-screen">
         <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-5xl font-serif text-emerald-950 mb-12 text-center">
              {isMarathi ? "सर्व पदाधिकारी मनोगत" : "All Leadership Messages"}
            </h1>
            <div className="grid md:grid-cols-2 gap-8">
              {members.map(member => {
                 const data = getMemberMessageData(member);
                 if (!data.finalMsgLines.length && !data.finalQuote) return null; // Skip if no message
                 return (
                   <div key={member.srNo} className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
                     <div className="flex items-center gap-6 mb-6">
                       <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md bg-white">
                         {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-amber-500"><Crown size={32}/></div>}
                       </div>
                       <div>
                         <h3 className="text-xl font-bold text-emerald-950">{data.finalName}</h3>
                         <p className="text-emerald-700 text-sm font-semibold mt-1">{data.finalTitle}</p>
                       </div>
                     </div>
                     {data.finalQuote && (
                        <p className="text-slate-700 italic border-l-4 border-amber-400 pl-4 mb-4 text-sm font-medium">"{data.finalQuote}"</p>
                     )}
                     <Link to={`/message/${member.srNo}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider">
                       {isMarathi ? "संपूर्ण मनोगत वाचा" : "Read Full Message"} <ChevronRight size={16} />
                     </Link>
                   </div>
                 );
              })}
            </div>
         </div>
      </div>
    );
  }

  // Single Leader View
  const mData = getMemberMessageData(activeMember);
  
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-emerald-950 text-white pt-24 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            {mData.finalTitle}
          </h1>
          <p className="text-xl text-emerald-100 font-light max-w-2xl mx-auto">
            {mData.finalName}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 border border-slate-100 flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/3 shrink-0 flex flex-col items-center text-center">
            <div className="w-64 md:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-8 border-white shadow-2xl -mt-24 bg-white z-30 mb-6">
              {mData.imageUrl ? (
                <img src={mData.imageUrl} alt={mData.finalName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-900/20">
                  <Crown size={80} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{mData.finalName}</h2>
            <p className="text-emerald-600 font-semibold mb-6">{mData.finalTitle}</p>
            
            {mData.member.phones?.length > 0 && (
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 justify-center">
                <Phone size={16} className="text-emerald-500" />
                <span>{mData.member.phones.join(', ')}</span>
              </div>
            )}
            
            {(mData.member.addressEnglish || mData.member.addressMarathi) && (
              <div className="flex items-center gap-2 text-slate-500 text-sm justify-center">
                <MapPin size={16} className="text-emerald-500 shrink-0" />
                <span>{isMarathi ? mData.member.addressMarathi : mData.member.addressEnglish}</span>
              </div>
            )}
          </div>

          <div className="lg:w-2/3">
            {mData.finalQuote && (
              <div className="bg-amber-50 rounded-2xl p-8 mb-8 border border-amber-100 relative">
                <Quote size={40} className="text-amber-200 absolute top-4 left-4" />
                <p className="text-xl md:text-2xl font-serif text-amber-900 leading-relaxed italic relative z-10 pl-6">
                  "{mData.finalQuote}"
                </p>
              </div>
            )}
            
            <div className="prose prose-emerald max-w-none text-slate-700 text-lg leading-relaxed text-justify space-y-6 mb-10">
              {mData.finalMsgLines.length > 0 ? (
                mData.finalMsgLines.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p className="text-slate-400 italic text-center">
                  {isMarathi ? "या पदाधिकाऱ्याचा संदेश लवकरच उपलब्ध होईल." : "Message from this leader will be updated soon."}
                </p>
              )}
            </div>

            {mData.finalMsgLines.length > 0 && (
              <div className="mt-12 text-right border-t border-slate-200 pt-8">
                <h4 className="text-2xl font-bold text-emerald-950 font-serif mb-1">{mData.finalName}</h4>
                <p className="text-emerald-700 font-semibold">{mData.finalTitle}</p>
                <p className="text-slate-500 text-sm mt-1">{isMarathi ? "सर्वोदय शिक्षण मंडळ, चंद्रपूर" : "Sarvodaya Shikshan Mandal, Chandrapur"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
