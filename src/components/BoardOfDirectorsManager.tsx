import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Image as ImageIcon, Users, CheckCircle2, ChevronUp, ChevronDown, Award, UploadCloud } from 'lucide-react';
import { fetchContentBlocks, saveContentBlock, uploadAnnouncementAttachment } from '../lib/api';
import { EXECUTIVE_COMMITTEE, ExecutiveMember } from '../data/mandalData';
import { useConfirm } from './ConfirmDialogContext';

// Basic ImageUploader adapted for the form
function MiniImageUploader({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadAnnouncementAttachment(file); // Re-use the generic upload endpoint
      if (result.url) onChange(result.url);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {value && (
        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL or Path"
          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm mb-2"
        />
        <label className="text-xs font-bold px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded cursor-pointer inline-flex items-center gap-1 transition-colors">
          <UploadCloud size={14} /> {uploading ? "Uploading..." : "Upload Photo"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>
    </div>
  );
}

export function BoardOfDirectorsManager() {
  const { confirm } = useConfirm();
  const [members, setMembers] = useState<ExecutiveMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<ExecutiveMember> | null>(null);
  
  const [contentData, setContentData] = useState<Record<string, string>>({});
  const [messageFields, setMessageFields] = useState({ quoteEn: '', quoteMr: '', textEn: '', textMr: '' });

  // Load banner info
  const [bannerUrl, setBannerUrl] = useState('');
  const [savingBanner, setSavingBanner] = useState(false);

  useEffect(() => {
    fetchContentBlocks().then((data) => {
      setContentData(data);
      // 1. Load Banner
      setBannerUrl(data['BoardOfDirectors_Banner'] || data['Management_Banner_Image'] || '');
      
      // 2. Load Members
      if (data['Custom_BoardOfDirectors']) {
        try {
          const parsed = JSON.parse(data['Custom_BoardOfDirectors']);
          // Merge old legacy photos from LeaderX_Image if imageUrl is missing
          const merged = parsed.map((m: any) => ({
            ...m,
            imageUrl: m.imageUrl || data[`Leader${m.srNo}_Image`] || ''
          }));
          setMembers(merged);
        } catch(e) {
          console.error(e);
          initializeFromStatic(data);
        }
      } else {
        initializeFromStatic(data);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  const initializeFromStatic = (data: Record<string,string>) => {
    const initialized = EXECUTIVE_COMMITTEE.map(m => ({
      ...m,
      imageUrl: data[`Leader${m.srNo}_Image`] || ''
    }));
    setMembers(initialized);
  };

  const saveBoardToDb = async (updatedMembers: ExecutiveMember[]) => {
    await saveContentBlock('Custom_BoardOfDirectors', JSON.stringify(updatedMembers));
  };

  const handleSaveBanner = async () => {
    setSavingBanner(true);
    try {
      await saveContentBlock('BoardOfDirectors_Banner', bannerUrl);
      await saveContentBlock('Management_Banner_Image', bannerUrl);
      setSuccessMsg('Banner updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(e) {
      console.error(e);
      alert('Failed to save banner');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleAddNew = () => {
    setEditingMember({
      srNo: members.length > 0 ? Math.max(...members.map(m => m.srNo)) + 1 : 1,
      nameEnglish: '',
      nameMarathi: '',
      designationEnglish: '',
      designationMarathi: '',
      addressEnglish: '',
      addressMarathi: '',
      phones: [],
      roleBadge: 'member',
      isProminent: false,
      imageUrl: ''
    });
    setMessageFields({ quoteEn: '', quoteMr: '', textEn: '', textMr: '' });
    setIsEditing(true);
  };

  const handleEdit = (member: ExecutiveMember) => {
    setEditingMember(member);
    
    // Attempt to load from generic LeaderX keys first, otherwise from legacy keys for the first few
    let qEn = contentData[`Leader${member.srNo}_Quote_En`] || '';
    let qMr = contentData[`Leader${member.srNo}_Quote_Mr`] || '';
    let tEn = contentData[`Leader${member.srNo}_Text_En`] || '';
    let tMr = contentData[`Leader${member.srNo}_Text_Mr`] || '';

    // Legacy fallbacks
    if (member.srNo === 1 && !tEn) {
      qEn = contentData['President_Quote_En'] || qEn;
      qMr = contentData['President_Quote_Mr'] || qMr;
      tEn = contentData['President_Text_En'] || tEn;
      tMr = contentData['President_Text_Mr'] || tMr;
    } else if (member.srNo === 2 && !tEn) {
      qEn = contentData['WorkingPresident_Quote_En'] || qEn;
      qMr = contentData['WorkingPresident_Quote_Mr'] || qMr;
      tEn = contentData['WorkingPresident_Text_En'] || tEn;
      tMr = contentData['WorkingPresident_Text_Mr'] || tMr;
    } else if (member.srNo === 5 && !tEn) {
      qEn = contentData['Secretary_Quote_En'] || qEn;
      qMr = contentData['Secretary_Quote_Mr'] || qMr;
      tEn = contentData['Secretary_Text_En'] || tEn;
      tMr = contentData['Secretary_Text_Mr'] || tMr;
    }

    setMessageFields({ quoteEn: qEn, quoteMr: qMr, textEn: tEn, textMr: tMr });
    setIsEditing(true);
  };

  const handleDelete = async (srNo: number) => {
    if (await confirm({ title: 'Delete Member', message: 'Are you sure you want to remove this member from the Board of Directors?' })) {
      const updated = members.filter(m => m.srNo !== srNo);
      setMembers(updated);
      await saveBoardToDb(updated);
    }
  };

  const moveMember = async (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= members.length) return;
    const updated = [...members];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;
    // Update srNo to match visual order? Or keep them as IDs? 
    // We should probably keep srNo as ID but update them to match array order so frontend renders correctly.
    const reordered = updated.map((m, i) => ({ ...m, srNo: i + 1 }));
    setMembers(reordered);
    await saveBoardToDb(reordered);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    
    setSavingAll(true);
    try {
      let updated: ExecutiveMember[];
      if (members.find(m => m.srNo === editingMember.srNo)) {
        updated = members.map(m => m.srNo === editingMember.srNo ? editingMember as ExecutiveMember : m);
      } else {
        updated = [...members, editingMember as ExecutiveMember];
      }
      
      // Also write back to LeaderX_Image for legacy backwards compatibility in other views
      if (editingMember.imageUrl) {
        await saveContentBlock(`Leader${editingMember.srNo}_Image`, editingMember.imageUrl);
      }
      
      // Save Message Blocks
      await saveContentBlock(`Leader${editingMember.srNo}_Quote_En`, messageFields.quoteEn);
      await saveContentBlock(`Leader${editingMember.srNo}_Quote_Mr`, messageFields.quoteMr);
      await saveContentBlock(`Leader${editingMember.srNo}_Text_En`, messageFields.textEn);
      await saveContentBlock(`Leader${editingMember.srNo}_Text_Mr`, messageFields.textMr);
      
      // Update local contentData cache so immediate edits work
      setContentData(prev => ({
        ...prev,
        [`Leader${editingMember.srNo}_Quote_En`]: messageFields.quoteEn,
        [`Leader${editingMember.srNo}_Quote_Mr`]: messageFields.quoteMr,
        [`Leader${editingMember.srNo}_Text_En`]: messageFields.textEn,
        [`Leader${editingMember.srNo}_Text_Mr`]: messageFields.textMr,
      }));
      
      
      setMembers(updated);
      await saveBoardToDb(updated);
      setSuccessMsg('Member details saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
      setEditingMember(null);
    } catch(err) {
      console.error(err);
      alert('Failed to save member details');
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading board...</div>;

  if (isEditing && editingMember) {
    return (
      <div className="max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {members.find(m => m.srNo === editingMember.srNo) ? 'Edit Board Member' : 'Add New Board Member'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg">Cancel</button>
        </div>
        <form onSubmit={handleSaveMember} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Name (English)</label>
              <input required type="text" value={editingMember.nameEnglish || ''} onChange={e => setEditingMember({...editingMember, nameEnglish: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Name (Marathi)</label>
              <input required type="text" value={editingMember.nameMarathi || ''} onChange={e => setEditingMember({...editingMember, nameMarathi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Designation (English)</label>
              <input required type="text" value={editingMember.designationEnglish || ''} onChange={e => setEditingMember({...editingMember, designationEnglish: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Designation (Marathi)</label>
              <input required type="text" value={editingMember.designationMarathi || ''} onChange={e => setEditingMember({...editingMember, designationMarathi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Role / Badge Type</label>
              <select value={editingMember.roleBadge || 'member'} onChange={e => setEditingMember({...editingMember, roleBadge: e.target.value as any})} className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white">
                <option value="president">President</option>
                <option value="working_president">Working President</option>
                <option value="vice_president">Vice President</option>
                <option value="secretary">Secretary</option>
                <option value="joint_secretary">Joint Secretary</option>
                <option value="treasurer">Treasurer</option>
                <option value="member">General Member</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number(s)</label>
              <input type="text" value={editingMember.phones?.join(', ') || ''} onChange={e => setEditingMember({...editingMember, phones: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} placeholder="Comma separated" className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Address (English)</label>
              <input type="text" value={editingMember.addressEnglish || ''} onChange={e => setEditingMember({...editingMember, addressEnglish: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Address (Marathi)</label>
              <input type="text" value={editingMember.addressMarathi || ''} onChange={e => setEditingMember({...editingMember, addressMarathi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Photo</label>
              <MiniImageUploader value={editingMember.imageUrl || ''} onChange={(val) => setEditingMember({...editingMember, imageUrl: val})} />
            </div>
            
            <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                Personal Message & Quotes (Optional)
              </h3>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Short Quote (English)</label>
              <textarea value={messageFields.quoteEn} onChange={e => setMessageFields({...messageFields, quoteEn: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 min-h-[60px]" placeholder="e.g. To realize the vision of Sarvodaya..." />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Short Quote (Marathi)</label>
              <textarea value={messageFields.quoteMr} onChange={e => setMessageFields({...messageFields, quoteMr: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 min-h-[60px]" placeholder="उदा. ज्ञान, शील आणि संस्कारांच्या माध्यमातून..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Message (English)</label>
              <textarea value={messageFields.textEn} onChange={e => setMessageFields({...messageFields, textEn: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 min-h-[120px]" placeholder="The complete message text in English..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Message (Marathi)</label>
              <textarea value={messageFields.textMr} onChange={e => setMessageFields({...messageFields, textMr: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 min-h-[120px]" placeholder="मराठीतील संपूर्ण मनोगत..." />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" checked={editingMember.isProminent || false} onChange={e => setEditingMember({...editingMember, isProminent: e.target.checked})} className="w-4 h-4 text-emerald-600" />
                Highlight as Prominent Member (Bigger Card)
              </label>
            </div>
          </div>
          <div className="pt-6 flex gap-3">
            <button type="submit" disabled={savingAll} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
              {savingAll ? "Saving..." : <><Save size={18} /> Save Member</>}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Users size={14} /> Sub Menu: Board of Directors
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">
            Board of Directors (कार्यकारिणी मंडळ)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage the list of board members, their designations, and photos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
          <button onClick={handleAddNew} className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all text-sm">
            <Plus size={16} /> Add New Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon size={16} className="text-amber-600" />
            Page Banner Photo (Optional)
          </h2>
          <button onClick={handleSaveBanner} disabled={savingBanner} className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
            <Save size={14} /> {savingBanner ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
        <MiniImageUploader value={bannerUrl} onChange={setBannerUrl} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="p-4 w-16 text-center">Order</th>
              <th className="p-4 w-20">Photo</th>
              <th className="p-4">Name & Designation</th>
              <th className="p-4 hidden sm:table-cell">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.srNo} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => moveMember(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-emerald-600 disabled:opacity-30"><ChevronUp size={16} /></button>
                    <span className="text-sm font-bold text-slate-400">{index + 1}</span>
                    <button onClick={() => moveMember(index, 1)} disabled={index === members.length - 1} className="text-slate-300 hover:text-emerald-600 disabled:opacity-30"><ChevronDown size={16} /></button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Users size={20} className="text-slate-300" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    {member.nameEnglish}
                    {member.isProminent && <Award size={14} className="text-amber-500" title="Prominent Member" />}
                  </div>
                  <div className="text-xs text-slate-500">{member.nameMarathi}</div>
                  <div className="text-xs font-medium text-emerald-700 mt-1">{member.designationEnglish}</div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {member.roleBadge.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(member)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(member.srNo)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No board members found. Click 'Add New Member' to start.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
