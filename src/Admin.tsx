import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  login, logout, 
  fetchAnnouncements, saveAnnouncement, updateAnnouncement, deleteAnnouncement, 
  fetchEvents, saveEvent, updateEvent, deleteEvent, 
  fetchInstitutions, saveInstitution, updateInstitution, deleteInstitution, 
  fetchContentBlocks, saveContentBlock,
  fetchCareers, saveCareer, updateCareer, deleteCareer,
  fetchJobApplications, deleteJobApplication, updateJobApplicationStatus,
  fetchAdvertisementPdf, uploadAdvertisementPdf, deleteAdvertisementPdf, uploadCareerAttachment,
  uploadAnnouncementAttachment,
  fetchInquiries, getDownloadUrl
} from './lib/api';
import { EXECUTIVE_COMMITTEE, MANDAL_INSTITUTIONS } from './data/mandalData';
import { 
  User, LayoutDashboard, LogOut, Megaphone, Calendar as CalendarIcon, Settings, Briefcase, 
  Plus, Edit, Trash2, Building, BookOpen, Shield, Mail, Lock, ArrowRight, ArrowLeft, 
  Image as ImageIcon, Phone, Home, Info, Users, BarChart, Quote, UploadCloud, CheckCircle2, 
  Save, ExternalLink, GraduationCap, Globe, Download, FileText, Filter, Search, Eye, 
  CheckCircle, Clock, AlertTriangle, XCircle, Printer, RefreshCw, ChevronDown, ChevronUp, 
  FileSpreadsheet, X, Paperclip, Check, Menu, RotateCcw, HelpCircle, Languages, Layers, Sparkles
} from 'lucide-react';
import { ConfirmProvider, useConfirm } from './components/ConfirmDialogContext';
import { AlumniAdmin } from './components/AlumniAdmin';
import { BoardOfDirectorsManager } from './components/BoardOfDirectorsManager';
import { CONTENT_METADATA, getDefaultContent } from './data/contentDefaults';

import { AdminsManager } from './components/AdminsManager';


function CareersAdmin() {
  const { confirm } = useConfirm();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-Time',
    description: '',
    requirements: '',
    advertisementUrl: '',
    advertisementOriginalName: '',
    advertisementType: 'pdf'
  });
  
  // Opening attachment upload state
  const [uploadingOpeningAd, setUploadingOpeningAd] = useState(false);
  const [openingAdMsg, setOpeningAdMsg] = useState({ type: '', text: '' });

  // Main recruitment advertisement notice state
  const [advertisement, setAdvertisement] = useState<any>(null);
  const [adFile, setAdFile] = useState<File | null>(null);
  const [advtTitle, setAdvtTitle] = useState('');
  const [uploadingAd, setUploadingAd] = useState(false);
  const [advtMessage, setAdvtMessage] = useState({ type: '', text: '' });

  // Filter & general action notification
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState({ type: '', text: '' });
  const [imageLightboxUrl, setImageLightboxUrl] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    fetchCareers()
      .then(data => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchAdvertisementPdf()
      .then(data => {
        setAdvertisement(data);
        if (data && (data.hasPdf || data.hasFile) && data.title) {
          setAdvtTitle(data.title);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handler for uploading main advertisement notification (PDF or JPEG)
  const handleMainAdUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFile) {
      alert('Please choose a PDF document or JPEG/PNG advertisement image to upload.');
      return;
    }
    setUploadingAd(true);
    setAdvtMessage({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('file', adFile);
      if (advtTitle.trim()) {
        fd.append('title', advtTitle.trim());
      }
      await uploadAdvertisementPdf(fd);
      setAdvtMessage({ 
        type: 'success', 
        text: 'Official Recruitment Advertisement (PDF / JPEG) uploaded and published successfully!' 
      });
      setAdFile(null);
      loadData();
      setTimeout(() => setAdvtMessage({ type: '', text: '' }), 4500);
    } catch (err: any) {
      setAdvtMessage({ type: 'error', text: err.message || 'Failed to upload recruitment advertisement.' });
    } finally {
      setUploadingAd(false);
    }
  };

  const handleMainAdDelete = async () => {
    if (await confirm({ title: 'Remove Advertisement', message: 'Are you sure you want to remove the recruitment advertisement from the public website?' })) {
      try {
        await deleteAdvertisementPdf();
        setAdvtMessage({ type: 'success', text: 'Official advertisement removed.' });
        loadData();
        setTimeout(() => setAdvtMessage({ type: '', text: '' }), 3500);
      } catch (err: any) {
        alert(err.message || 'Failed to delete advertisement.');
      }
    }
  };

  // Handler for uploading PDF or JPEG advertisement attached to a specific position/opening
  const handleOpeningAttachmentUpload = async (file: File) => {
    if (!file) return;
    setUploadingOpeningAd(true);
    setOpeningAdMsg({ type: '', text: '' });
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await uploadCareerAttachment(fd);
      setFormData(prev => ({
        ...prev,
        advertisementUrl: res.url,
        advertisementOriginalName: res.originalName,
        advertisementType: res.fileType || (file.type.startsWith('image/') ? 'image' : 'pdf')
      }));
      setOpeningAdMsg({
        type: 'success',
        text: `Attachment uploaded successfully: ${res.originalName} (${res.fileType === 'image' ? 'JPEG / Image' : 'PDF Document'})`
      });
      setTimeout(() => setOpeningAdMsg({ type: '', text: '' }), 4000);
    } catch (err: any) {
      setOpeningAdMsg({
        type: 'error',
        text: err.message || 'Failed to upload advertisement attachment.'
      });
    } finally {
      setUploadingOpeningAd(false);
    }
  };

  const removeOpeningAttachment = () => {
    setFormData(prev => ({
      ...prev,
      advertisementUrl: '',
      advertisementOriginalName: '',
      advertisementType: 'pdf'
    }));
  };

  // Submit new or updated opening
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCareer(editingId, formData);
        setActionNotice({ type: 'success', text: `Position "${formData.title}" updated successfully!` });
      } else {
        await saveCareer(formData);
        setActionNotice({ type: 'success', text: `New position "${formData.title}" published with advertisement!` });
      }
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'Full-Time',
        description: '',
        requirements: '',
        advertisementUrl: '',
        advertisementOriginalName: '',
        advertisementType: 'pdf'
      });
      setEditingId(null);
      fetchCareers().then(data => setItems(Array.isArray(data) ? data : []));
      setTimeout(() => setActionNotice({ type: '', text: '' }), 4000);
    } catch (error: any) {
      alert(error.message || 'Failed to save position opening.');
    }
  };

  // Load opening into edit form
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      department: item.department || '',
      location: item.location || '',
      type: item.type || 'Full-Time',
      description: item.description || '',
      requirements: item.requirements || '',
      advertisementUrl: item.advertisementUrl || '',
      advertisementOriginalName: item.advertisementOriginalName || '',
      advertisementType: item.advertisementType || (item.advertisementUrl?.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
    });
    // Scroll smoothly to form
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Delete earlier opening
  const handleDeleteOpening = async (item: any) => {
    const confirmMsg = `Are you sure you want to delete this opening:\n"${item.title}" (${item.department})?\n\nThis will permanently remove this earlier opening from the public Careers page.`;
    if (await confirm({ title: 'Delete Opening', message: confirmMsg })) {
      try {
        await deleteCareer(item.id);
        setActionNotice({
          type: 'success',
          text: `Earlier opening "${item.title}" was deleted permanently from records.`
        });
        const updated = await fetchCareers();
        setItems(Array.isArray(updated) ? updated : []);
        if (editingId === item.id) {
          setEditingId(null);
          setFormData({
            title: '',
            department: '',
            location: '',
            type: 'Full-Time',
            description: '',
            requirements: '',
            advertisementUrl: '',
            advertisementOriginalName: '',
            advertisementType: 'pdf'
          });
        }
        setTimeout(() => setActionNotice({ type: '', text: '' }), 4500);
      } catch (error: any) {
        alert(error.message || 'Failed to delete opening.');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.department && item.department.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Lightbox Modal for Full Image View */}
      {imageLightboxUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setImageLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ImageIcon size={16} className="text-amber-600" /> Advertisement Image Full Preview
              </span>
              <button
                type="button"
                onClick={() => setImageLightboxUrl(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[78vh] flex items-center justify-center bg-slate-900/5">
              <img
                src={imageLightboxUrl}
                alt="Advertisement"
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <a
                href={imageLightboxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <ExternalLink size={14} /> Open in New Tab
              </a>
              <button
                type="button"
                onClick={() => setImageLightboxUrl(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase size={14} /> Recruitment & Openings Management
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">Careers & Advertisement Portal</h2>
          <p className="text-slate-500 text-sm mt-1">
            Post new positions with attached PDF or JPEG advertisement notices, manage current listings, and remove earlier openings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <a
            href="/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink size={14} /> View Public Page
          </a>
        </div>
      </div>

      {actionNotice.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xs animate-in fade-in ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {actionNotice.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-red-600" />}
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* SECTION 1: MASTER RECRUITMENT ADVERTISEMENT (PDF or JPEG) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Central Newspaper / Official Notice</span>
              <h3 className="text-xl font-bold">Master Advertisement (अधिकृत भरती जाहिरात - PDF किंवा फोटो)</h3>
            </div>
          </div>
          {(advertisement?.hasFile || advertisement?.hasPdf) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold self-start md:self-auto">
              <CheckCircle size={14} /> Live on Careers Page
            </span>
          )}
        </div>

        <div className="p-6 md:p-8">
          {advtMessage.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              advtMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {advtMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              {advtMessage.text}
            </div>
          )}

          {/* Current Master Advertisement Card */}
          {(advertisement?.hasFile || advertisement?.hasPdf || advertisement?.url) ? (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                {advertisement.fileType === 'image' ? (
                  <div 
                    onClick={() => setImageLightboxUrl(advertisement.url || advertisement.pdfUrl)}
                    className="w-14 h-14 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 overflow-hidden border border-amber-300 cursor-pointer group relative"
                    title="Click to preview image"
                  >
                    <img 
                      src={advertisement.url || advertisement.pdfUrl} 
                      alt="Ad Preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-sm">
                    PDF
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      advertisement.fileType === 'image' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {advertisement.fileType === 'image' ? 'JPEG / Image Notice' : 'PDF Document'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-base">{advertisement.title || 'Official Recruitment Advertisement'}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    File: <span className="font-mono text-slate-700">{advertisement.originalName || 'advertisement'}</span>
                    {advertisement.uploadedAt && ` • Uploaded: ${new Date(advertisement.uploadedAt).toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {advertisement.fileType === 'image' ? (
                  <button
                    type="button"
                    onClick={() => setImageLightboxUrl(advertisement.url || advertisement.pdfUrl)}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye size={14} /> Preview Image
                  </button>
                ) : (
                  <a
                    href={getDownloadUrl(advertisement.url || advertisement.pdfUrl, advertisement.originalName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Eye size={14} /> Preview PDF
                  </a>
                )}
                <a
                  href={getDownloadUrl(advertisement.url || advertisement.pdfUrl, advertisement.originalName)}
                  download={advertisement.originalName || 'SSM_Recruitment_Advertisement'}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  type="button"
                  onClick={handleMainAdDelete}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-900 text-sm flex items-start gap-3">
              <AlertTriangle size={16} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">No master recruitment advertisement is currently published.</p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Upload the official recruitment notification (PDF or JPEG/PNG newspaper clipping) below. It will be instantly featured at the top of the Careers page.
                </p>
              </div>
            </div>
          )}

          {/* Upload Form for Master Advertisement */}
          <form onSubmit={handleMainAdUpload} className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-800 text-sm">
              {(advertisement?.hasFile || advertisement?.hasPdf) ? 'Replace / Update Master Advertisement (PDF / JPEG)' : 'Upload Master Advertisement (PDF / JPEG)'}
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Advertisement Notice Title
                </label>
                <input
                  type="text"
                  placeholder="उदा. सर्वोदय शिक्षण मंडळ भरती २०२६ - अधिकृत वर्तमानपत्र जाहिरात"
                  value={advtTitle}
                  onChange={(e) => setAdvtTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select File (PDF or JPEG / PNG Image) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => setAdFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
                {adFile && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    Selected: {adFile.name} ({(adFile.size / 1024 / 1024).toFixed(2)} MB) - {adFile.type.startsWith('image/') ? 'Image (JPEG/PNG)' : 'PDF Document'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={uploadingAd || !adFile}
                className="bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {uploadingAd ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Uploading Advertisement...
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} /> Upload & Publish Advertisement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: ADD / EDIT POSITION & OPENING WITH ADVERTISEMENT ATTACHMENT */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Plus size={20} className="text-emerald-700" />
              {editingId ? 'Edit Job Opening (पदाचा तपशील बदला)' : 'Post New Position & Opening (नवीन पद व जाहिरात जोडा)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Admin can fill in the position details and upload the PDF or JPEG advertisement for this opening.
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  department: '',
                  location: '',
                  type: 'Full-Time',
                  description: '',
                  requirements: '',
                  advertisementUrl: '',
                  advertisementOriginalName: '',
                  advertisementType: 'pdf'
                });
              }}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title / Position (पदाचे नाव) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Assistant Professor in Chemistry / Clerk / Peon"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department / Faculty (विभाग / शाखा) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Science Faculty / Commerce / Administration"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus / Location (संस्था / ठिकाण) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sardar Patel Mahavidyalaya, Chandrapur"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Employment Type (नोकरीचा प्रकार) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white"
                required
              >
                <option value="Full-Time">Full-Time (कायमस्वरूपी / पूर्ण वेळ)</option>
                <option value="Clock Hour Basis (CHB)">Clock Hour Basis (CHB - तासिका तत्त्वावर)</option>
                <option value="Part-Time">Part-Time (अंशकालीन)</option>
                <option value="Contract">Contract (करार पद्धतीवर)</option>
                <option value="Temporary">Temporary (तात्पुरते)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Description & Responsibilities (कामाचे स्वरूप) <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Teaching undergraduate/postgraduate students, guiding laboratory practicals, institutional responsibilities..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white min-h-[90px]"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Educational Qualifications & Eligibility (पात्रता व अटी) <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Postgraduate Degree with minimum 55% marks, NET/SET qualified or Ph.D. as per UGC/Government norms..."
              value={formData.requirements}
              onChange={e => setFormData({...formData, requirements: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:bg-white min-h-[90px]"
              required
            ></textarea>
          </div>

          {/* ATTACH ADVERTISEMENT FILE (PDF or JPEG) TO THIS OPENING */}
          <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-amber-700" />
              <h4 className="font-bold text-slate-800 text-sm">
                Attach Advertisement for this Opening (या पदाची अधिकृत जाहिरात प्रत - PDF किंवा JPEG फोटो)
              </h4>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              When candidates apply for this position, they will be able to view and download this exact advertisement PDF or JPEG newspaper notification.
            </p>

            {openingAdMsg.text && (
              <div className={`mb-4 p-3 rounded-lg text-xs font-medium ${
                openingAdMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {openingAdMsg.text}
              </div>
            )}

            {formData.advertisementUrl ? (
              <div className="bg-white rounded-xl p-4 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {formData.advertisementType === 'image' ? (
                    <div 
                      onClick={() => setImageLightboxUrl(formData.advertisementUrl)}
                      className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 overflow-hidden border border-amber-200 cursor-pointer"
                      title="Click to view image"
                    >
                      <img src={formData.advertisementUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      PDF
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Attached: {formData.advertisementType === 'image' ? 'JPEG / PNG Photo' : 'PDF Document'}
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {formData.advertisementOriginalName || 'Advertisement File'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {formData.advertisementType === 'image' ? (
                    <button
                      type="button"
                      onClick={() => setImageLightboxUrl(formData.advertisementUrl)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Eye size={13} /> View Photo
                    </button>
                  ) : (
                    <a
                      href={getDownloadUrl(formData.advertisementUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Eye size={13} /> View PDF
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={removeOpeningAttachment}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <X size={14} /> Remove Attachment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp,image/jpg"
                      disabled={uploadingOpeningAd}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleOpeningAttachmentUpload(file);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                    />
                  </div>
                </div>
                {uploadingOpeningAd && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 font-bold">
                    <RefreshCw size={14} className="animate-spin" /> Uploading attachment file...
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Or enter direct document/image URL:</span>
                  <input
                    type="text"
                    placeholder="https://example.com/advertisement.pdf or local path"
                    value={formData.advertisementUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      const isImg = /\.(jpe?g|png|webp|gif)$/i.test(url);
                      setFormData(prev => ({
                        ...prev,
                        advertisementUrl: url,
                        advertisementType: isImg ? 'image' : 'pdf',
                        advertisementOriginalName: url.split('/').pop() || 'advertisement'
                      }));
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    title: '',
                    department: '',
                    location: '',
                    type: 'Full-Time',
                    description: '',
                    requirements: '',
                    advertisementUrl: '',
                    advertisementOriginalName: '',
                    advertisementType: 'pdf'
                  });
                }}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md"
            >
              <CheckCircle2 size={16} /> {editingId ? 'Update Position' : 'Save & Publish Position'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: ALL ACTIVE & EARLIER OPENINGS LIST WITH DELETE FUNCTIONALITY */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-800 flex items-center gap-2">
              <span>All Active & Earlier Openings (सर्व उपलब्ध पदे)</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                {items.length} Total
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin can edit details or delete any earlier opening permanently using the Delete button.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search earlier openings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-emerald-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500">
            <Users size={36} className="mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-700">No career openings found</p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery ? 'No openings match your search filter.' : 'No positions posted yet. Use the form above to add a new opening.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full">
                      {item.department || 'General'}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                      {item.location}
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full">
                      {item.type}
                    </span>

                    {/* Attached Advertisement Badge */}
                    {item.advertisementUrl && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        item.advertisementType === 'image' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.advertisementType === 'image' ? <ImageIcon size={12} /> : <FileText size={12} />}
                        <span>{item.advertisementType === 'image' ? 'JPEG Ad Attached' : 'PDF Ad Attached'}</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-serif font-bold text-slate-900">{item.title}</h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    <strong className="text-slate-800">Description: </strong>
                    {item.description}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    <strong className="text-slate-800">Requirements: </strong>
                    {item.requirements}
                  </p>

                  {/* Attached File Action Link */}
                  {item.advertisementUrl && (
                    <div className="pt-1">
                      {item.advertisementType === 'image' ? (
                        <button
                          type="button"
                          onClick={() => setImageLightboxUrl(item.advertisementUrl)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <Eye size={13} /> View Attached Advertisement Image (जाहिरात फोटो)
                        </button>
                      ) : (
                        <a
                          href={getDownloadUrl(item.advertisementUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                        >
                          <FileText size={13} /> View Attached Advertisement PDF (जाहिरात PDF)
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 md:flex-initial px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOpening(item)}
                    className="flex-1 md:flex-initial px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    title="Delete this earlier opening permanently"
                  >
                    <Trash2 size={14} /> Delete Opening
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function JobApplicationsAdmin() {
  const { confirm } = useConfirm();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const loadApplications = () => {
    setLoading(true);
    fetchJobApplications()
      .then(data => {
        setApps(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDelete = async (id: string) => {
    if (await confirm({ title: 'Delete Application', message: 'Delete this candidate application permanently from records?' })) {
      await deleteJobApplication(id);
      loadApplications();
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, notes?: string) => {
    setUpdatingId(id);
    try {
      await updateJobApplicationStatus(id, newStatus, notes);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, adminNotes: notes !== undefined ? notes : a.adminNotes } : a));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev: any) => ({ ...prev, status: newStatus, adminNotes: notes !== undefined ? notes : prev.adminNotes }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Extract distinct positions with count
  const positionsList = React.useMemo(() => {
    const counts: Record<string, number> = {};
    apps.forEach(app => {
      const pos = app.jobTitle?.trim() || 'General Application';
      counts[pos] = (counts[pos] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [apps]);

  // Filtered applications
  const filteredApps = React.useMemo(() => {
    return apps.filter(app => {
      const pos = app.jobTitle?.trim() || 'General Application';
      if (selectedPosition !== 'all' && pos !== selectedPosition) {
        return false;
      }
      if (statusFilter !== 'all') {
        const appStatus = (app.status || 'new').toLowerCase();
        if (appStatus !== statusFilter.toLowerCase()) {
          return false;
        }
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const details = typeof app.details === 'object' ? app.details : {};
        const matchesName = (app.name || '').toLowerCase().includes(term);
        const matchesNameMr = (details.candidateNameMarathi || '').toLowerCase().includes(term);
        const matchesEmail = (app.email || '').toLowerCase().includes(term);
        const matchesPhone = (app.phone || '').toLowerCase().includes(term);
        const matchesAppNo = (details.applicationNumber || `SSM-${app.id}`).toLowerCase().includes(term);
        const matchesPos = pos.toLowerCase().includes(term);
        if (!matchesName && !matchesNameMr && !matchesEmail && !matchesPhone && !matchesAppNo && !matchesPos) {
          return false;
        }
      }
      return true;
    });
  }, [apps, selectedPosition, statusFilter, searchTerm]);

  // Export CSV Report with UTF-8 BOM
  const handleExportCsv = () => {
    if (filteredApps.length === 0) {
      alert('No applications to export.');
      return;
    }

    const headers = [
      'Application No',
      'Applied Date',
      'Position Applied',
      'Preferred Institution',
      'Candidate Name (En)',
      'Candidate Name (Mr)',
      'Email',
      'Mobile',
      'Alt Mobile',
      'Gender',
      'DOB',
      'Age',
      'Category',
      'Caste',
      'Marital Status',
      'Aadhaar No',
      'PAN No',
      'Disability Status',
      'Address',
      'Taluka',
      'District',
      'State',
      'Pin Code',
      'SSC (% / Board / Year)',
      'HSC (% / Board / Year)',
      'Graduation (% / Degree / Univ / Year)',
      'Post Graduation (% / Degree / Univ / Year)',
      'NET / SET / GATE Qualified',
      'Ph.D. Details',
      'Total Experience (Years)',
      'Current Employer',
      'Current Designation',
      'Research Papers',
      'Status',
      'Admin Notes',
      'Resume URL'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredApps.map(app => {
      const d = (typeof app.details === 'object' && app.details !== null) ? app.details : {};
      const quals = Array.isArray(d.qualifications) ? d.qualifications : [];
      const ssc = quals.find((q: any) => q.exam === '10th / SSC');
      const hsc = quals.find((q: any) => q.exam === '12th / HSC');
      const grad = quals.find((q: any) => q.exam === 'Graduation');
      const pg = quals.find((q: any) => q.exam === 'Post Graduation');

      const sscSummary = ssc ? `${ssc.percentage}% (${ssc.boardUniversity}, ${ssc.passingYear})` : '';
      const hscSummary = hsc ? `${hsc.percentage}% (${hsc.boardUniversity}, ${hsc.passingYear})` : '';
      const gradSummary = grad ? `${grad.degree} - ${grad.percentage}% (${grad.boardUniversity}, ${grad.passingYear})` : '';
      const pgSummary = pg ? `${pg.degree} - ${pg.percentage}% (${pg.boardUniversity}, ${pg.passingYear})` : '';

      const netSet = [
        d.netQualified ? `NET (${d.netYear || ''})` : '',
        d.setQualified ? `SET (${d.setYear || ''})` : '',
        d.gateQualified ? `GATE (${d.gateYear || ''})` : '',
        d.phdAwarded ? `Ph.D. Awarded (${d.phdYear || ''})` : ''
      ].filter(Boolean).join(', ');

      return [
        d.applicationNumber || `SSM-APP-${app.id}`,
        app.created_at ? new Date(app.created_at).toLocaleDateString() : '',
        app.jobTitle || d.appliedPositionTitle || '',
        d.preferredInstitution || '',
        app.name || d.candidateNameEnglish || '',
        d.candidateNameMarathi || '',
        app.email || d.email || '',
        app.phone || d.mobile || '',
        d.altMobile || '',
        d.gender || '',
        d.dob || '',
        d.age ? `${d.age} Yrs` : '',
        d.category || '',
        d.caste || '',
        d.maritalStatus || '',
        d.aadhaarNo || '',
        d.panNo || '',
        d.isHandicapped ? `Yes (${d.handicappedNature || ''} ${d.handicappedPercent || ''}%)` : 'No',
        d.corrAddress || d.address || '',
        d.corrTaluka || '',
        d.corrDistrict || '',
        d.corrState || '',
        d.corrPinCode || '',
        sscSummary,
        hscSummary,
        gradSummary,
        pgSummary,
        netSet,
        d.phdSubject ? `${d.phdSubject} (${d.phdUniversity || ''})` : '',
        d.totalExperienceYears ? `${d.totalExperienceYears} Yrs` : '',
        d.currentOrganization || '',
        d.currentDesignation || '',
        d.researchPapersCount || '',
        app.status || 'new',
        app.adminNotes || '',
        app.resumeUrl ? (window.location.origin + app.resumeUrl) : ''
      ].map(escapeCsv).join(',');
    });

    // \uFEFF for UTF-8 Excel support
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const posTag = selectedPosition === 'all' ? 'All_Positions' : selectedPosition.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `SSM_Job_Applications_${posTag}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Individual Candidate Dossier
  const handlePrintIndividualSlip = (app: any) => {
    const d = (typeof app.details === 'object' && app.details !== null && Object.keys(app.details).length > 0) ? { ...app, ...app.details } : app;
    const quals = Array.isArray(d.qualifications) ? d.qualifications : (Array.isArray(app.qualifications) ? app.qualifications : []);
    const exp = Array.isArray(d.experience) ? d.experience : (Array.isArray(d.experiences) ? d.experiences : (Array.isArray(app.experience) ? app.experience : []));

    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) {
      alert('Please allow pop-ups to view printable candidate dossier.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Application Dossier - ${app.name || 'Candidate'}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #1e293b; line-height: 1.4; padding: 10px; margin: 0; }
          .header-box { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 12px; margin-bottom: 16px; position: relative; }
          .mandal-title { font-size: 20px; font-weight: bold; color: #064e3b; margin: 0; text-transform: uppercase; }
          .mandal-sub { font-size: 13px; color: #334155; margin: 3px 0; }
          .mandal-reg { font-size: 10px; color: #64748b; }
          .app-title-bar { background: #f1f5f9; padding: 6px 12px; font-weight: bold; font-size: 13px; color: #0f172a; margin-top: 10px; border-radius: 4px; display: flex; justify-content: space-between; }
          .section-title { font-size: 13px; font-weight: bold; color: #064e3b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; text-transform: uppercase; }
          table.info-grid { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
          table.info-grid td { padding: 4px 8px; vertical-align: top; font-size: 11px; }
          table.info-grid td.label { font-weight: bold; color: #475569; width: 22%; background: #f8fafc; border: 1px solid #e2e8f0; }
          table.info-grid td.value { border: 1px solid #e2e8f0; width: 28%; }
          table.data-table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 12px; }
          table.data-table th { background: #064e3b; color: #fff; font-size: 10px; padding: 6px 8px; text-align: left; border: 1px solid #064e3b; }
          table.data-table td { font-size: 10px; padding: 5px 8px; border: 1px solid #cbd5e1; }
          .photo-box { position: absolute; right: 0; top: 0; width: 90px; height: 110px; border: 1px solid #94a3b8; background: #f8fafc; display: flex; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
          .photo-box img { width: 100%; height: 100%; object-fit: cover; }
          .signature-section { margin-top: 30px; display: flex; justify-content: space-between; padding: 0 20px; }
          .sig-box { text-align: center; width: 200px; border-top: 1px dashed #64748b; padding-top: 5px; font-size: 11px; font-weight: bold; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; padding: 8px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; color: #0369a1;">Candidate Official Application Slip & Dossier</span>
          <button onclick="window.print()" style="padding: 6px 14px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Print / Save as PDF</button>
        </div>

        <div class="header-box">
          <div style="margin-right: 110px;">
            <div class="mandal-title">सर्वोदय शिक्षण मंडळ, चंद्रपूर</div>
            <div class="mandal-sub">Sarvodaya Shikshan Mandal, Chandrapur (Maharashtra)</div>
            <div class="mandal-reg">Trust Regn. No. F-09 (C) • Central India's Premier Educational Network</div>
            <div class="app-title-bar">
              <span>POSITION: ${(app.jobTitle || d.appliedPositionTitle || 'GENERAL RECRUITMENT').toUpperCase()}</span>
              <span>APP NO: ${d.applicationNumber || `SSM-${app.id}`}</span>
              <span>DATE: ${app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          ${d.photoUrl ? `
            <div class="photo-box">
              <img src="${d.photoUrl}" alt="Photo" />
            </div>
          ` : `
            <div class="photo-box">
              <span style="font-size: 9px; color: #64748b;">PASSPORT<br>PHOTO</span>
            </div>
          `}
        </div>

        <div class="section-title">1. Personal & Identity Details</div>
        <table class="info-grid">
          <tr>
            <td class="label">Position Applied For:</td>
            <td class="value" colspan="3"><strong>${(app.jobTitle || d.appliedPositionTitle || 'GENERAL RECRUITMENT').toUpperCase()}</strong> ${d.institutionPreference ? `(${d.institutionPreference})` : ''}</td>
          </tr>
          <tr>
            <td class="label">Full Name (English):</td>
            <td class="value"><strong>${app.name || d.candidateNameEnglish || '-'}</strong></td>
            <td class="label">Full Name (Marathi):</td>
            <td class="value"><strong>${d.candidateNameMarathi || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label">Father's / Husband's Name:</td>
            <td class="value">${d.fatherHusbandName || '-'}</td>
            <td class="label">Mother's Name:</td>
            <td class="value">${d.motherName || '-'}</td>
          </tr>
          <tr>
            <td class="label">Date of Birth & Age:</td>
            <td class="value">${d.dob || '-'} (${d.age ? `${d.age} Yrs` : '-'})</td>
            <td class="label">Gender & Blood Group:</td>
            <td class="value">${d.gender || '-'} • ${d.bloodGroup || '-'}</td>
          </tr>
          <tr>
            <td class="label">Category & Caste:</td>
            <td class="value"><strong>${d.category || '-'}</strong> (${d.caste || '-'})</td>
            <td class="label">Marital Status & Nationality:</td>
            <td class="value">${d.maritalStatus || '-'} • ${d.nationality || 'Indian'}</td>
          </tr>
          <tr>
            <td class="label">Aadhaar & PAN Number:</td>
            <td class="value">${d.aadhaarNo || '-'} • ${d.panNo || '-'}</td>
            <td class="label">Persons with Disability (PwD):</td>
            <td class="value">${d.isHandicapped ? `Yes (${d.handicappedNature || ''} ${d.handicappedPercent || ''}%)` : 'No'}</td>
          </tr>
        </table>

        <div class="section-title">2. Contact & Address Details</div>
        <table class="info-grid">
          <tr>
            <td class="label">Mobile Number:</td>
            <td class="value"><strong>${app.phone || d.mobile || '-'}</strong></td>
            <td class="label">Alternate Mobile:</td>
            <td class="value">${d.altMobile || '-'}</td>
          </tr>
          <tr>
            <td class="label">Email Address:</td>
            <td class="value">${app.email || d.email || '-'}</td>
            <td class="label">Taluka & District:</td>
            <td class="value">${d.corrTaluka || '-'}, ${d.corrDistrict || '-'} (${d.corrState || 'Maharashtra'})</td>
          </tr>
          <tr>
            <td class="label">Correspondence Address:</td>
            <td class="value" colspan="3">${d.corrAddress || d.address || '-'} - PIN: ${d.corrPinCode || '-'}</td>
          </tr>
        </table>

        <div class="section-title">3. Academic & Educational Qualifications</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Examination</th>
              <th>Degree / Stream</th>
              <th>Board / University</th>
              <th>Passing Year</th>
              <th>Marks</th>
              <th>Percentage / CGPA</th>
              <th>Division</th>
            </tr>
          </thead>
          <tbody>
            ${quals.length > 0 ? quals.map((q: any) => `
              <tr>
                <td><strong>${q.exam}</strong></td>
                <td>${q.degree || '-'}</td>
                <td>${q.boardUniversity || '-'}</td>
                <td>${q.passingYear || '-'}</td>
                <td>${q.marksObtained ? `${q.marksObtained}/${q.totalMarks}` : '-'}</td>
                <td><strong>${q.percentage ? `${q.percentage}%` : '-'}</strong></td>
                <td>${q.divisionGrade || '-'}</td>
              </tr>
            `).join('') : `
              <tr><td colspan="7" style="text-align: center; color: #64748b;">No qualifications recorded.</td></tr>
            `}
          </tbody>
        </table>

        <div class="section-title">4. Teaching, Academic & Professional Experience</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Organization / College</th>
              <th>Designation</th>
              <th>Nature</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Period</th>
              <th>Pay Scale / Salary</th>
            </tr>
          </thead>
          <tbody>
            ${exp.length > 0 ? exp.map((e: any) => `
              <tr>
                <td><strong>${e.organization}</strong></td>
                <td>${e.designation || '-'}</td>
                <td>${e.nature || '-'}</td>
                <td>${e.fromDate || '-'}</td>
                <td>${e.toDate || '-'}</td>
                <td>${e.totalPeriod || '-'}</td>
                <td>${e.payScale || '-'}</td>
              </tr>
            `).join('') : `
              <tr><td colspan="7" style="text-align: center; color: #64748b;">Fresher / No prior experience recorded.</td></tr>
            `}
          </tbody>
        </table>

        <div class="section-title">5. Research Publications & Other Credentials</div>
        <table class="info-grid">
          <tr>
            <td class="label">NET / SET / GATE / Ph.D.:</td>
            <td class="value" colspan="3">
              ${[
                d.netQualified ? `NET Qualified (${d.netYear || ''})` : null,
                d.setQualified ? `SET Qualified (${d.setYear || ''})` : null,
                d.gateQualified ? `GATE (${d.gateYear || ''})` : null,
                d.phdAwarded ? `Ph.D. Awarded (${d.phdYear || ''} - ${d.phdSubject || ''})` : null
              ].filter(Boolean).join(' • ') || 'None'}
            </td>
          </tr>
          <tr>
            <td class="label">Research Papers / Books:</td>
            <td class="value">${d.researchPapersCount ? `${d.researchPapersCount} Published Papers` : 'None'} • ${d.booksCount ? `${d.booksCount} Books` : ''}</td>
            <td class="label">Preferred College / School:</td>
            <td class="value"><strong>${d.preferredInstitution || 'Any Institution of Mandal'}</strong></td>
          </tr>
        </table>

        <div style="margin-top: 15px; font-size: 10px; color: #64748b; font-style: italic;">
          Declaration: All particulars and statements furnished above by the candidate are true and complete to the best of knowledge and belief.
        </div>

        <div class="signature-section">
          <div class="sig-box">
            <br><br>
            Verified by Scrutiny Committee
          </div>
          <div class="sig-box">
            ${d.signatureUrl ? `<img src="${d.signatureUrl}" alt="Signature" style="height: 40px; object-fit: contain; margin-bottom: 5px; margin-top: -30px;" /><br>` : '<br><br>'}
            Candidate Signature
          </div>
          <div class="sig-box">
            <br><br>
            Hon. Secretary / Principal
          </div>
        </div>
      </body>
      </html>
    `;

    // Try iframe printing first for better compatibility and popup bypass
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    } else {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
      setTimeout(() => printWin.print(), 500);
    }
  };

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700', label: 'New Application' },
    under_review: { bg: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-700', label: 'Under Review' },
    shortlisted: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', label: 'Shortlisted' },
    interview: { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', label: 'Interview Scheduled' },
    selected: { bg: 'bg-green-100 text-green-800 border-green-200', text: 'text-green-700', label: 'Selected' },
    rejected: { bg: 'bg-red-100 text-red-800 border-red-200', text: 'text-red-700', label: 'Rejected' },
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">Job Applications & Candidate Data</h2>
          <p className="text-slate-500 text-sm mt-1">
            Review detailed candidate dossiers position-wise, track recruitment pipeline, and download individual or full reports.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={loadApplications}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleExportCsv}
            className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <FileSpreadsheet size={16} />
            <span>Download Full Report (CSV/Excel)</span>
          </button>
        </div>
      </div>

      {/* Position-Wise Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Filter size={14} /> Filter Applications by Position:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedPosition('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedPosition === 'all'
                ? 'bg-emerald-950 text-amber-400 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Positions</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              selectedPosition === 'all' ? 'bg-emerald-900 text-amber-300' : 'bg-slate-200 text-slate-700'
            }`}>
              {apps.length}
            </span>
          </button>

          {positionsList.map(([pos, count]) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                selectedPosition === pos
                  ? 'bg-emerald-950 text-amber-400 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{pos}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedPosition === pos ? 'bg-emerald-900 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Secondary Search & Status Row */}
        <div className="grid md:grid-cols-3 gap-3 pt-3 mt-3 border-t border-slate-100">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate by name, application number, email or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 font-medium text-slate-700"
            >
              <option value="all">All Application Statuses</option>
              <option value="new">New Applications</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview Scheduled</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>
          Showing <strong>{filteredApps.length}</strong> of <strong>{apps.length}</strong> candidate applications
          {selectedPosition !== 'all' && ` for "${selectedPosition}"`}
        </span>
        {filteredApps.length > 0 && (
          <span className="text-emerald-700 font-bold">
            Live database records
          </span>
        )}
      </div>

      {/* Candidate Applications List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <RefreshCw size={28} className="animate-spin text-emerald-800 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">Loading candidate dossiers...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h4 className="text-lg font-bold text-slate-800">No applications match your filter</h4>
          <p className="text-xs text-slate-500 mt-1">
            {apps.length === 0
              ? 'No candidate applications have been received yet. When candidates apply through the recruitment page, their comprehensive profiles will appear here.'
              : 'Try clearing the search term or switching to "All Positions".'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app: any) => {
            const d = (typeof app.details === 'object' && app.details !== null && Object.keys(app.details).length > 0) ? { ...app, ...app.details } : app;
            const quals = Array.isArray(d.qualifications) ? d.qualifications : (Array.isArray(app.qualifications) ? app.qualifications : []);
            const highestQual = quals.find((q: any) => q.exam === 'Post Graduation') ||
                                quals.find((q: any) => q.exam === 'Graduation') ||
                                quals[0];

            const currentStatus = (app.status || 'new').toLowerCase();
            const statusConfig = statusColors[currentStatus] || statusColors.new;

            return (
              <div
                key={app.id}
                className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3.5">
                    {/* Candidate Photo or Fallback Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shrink-0 text-emerald-900 font-bold font-serif text-lg">
                      {d.photoUrl || app.photoUrl ? (
                        <img src={d.photoUrl || app.photoUrl} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        (app.name || 'C').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>
                        {(d.candidateNameMarathi || app.nameMarathi) && (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {d.candidateNameMarathi || app.nameMarathi}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {d.applicationNumber || app.applicationNumber || `SSM-APP-${app.id}`}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-amber-700 mt-1 flex items-center gap-2">
                        <Briefcase size={12} />
                        <span>Applying for: {app.jobTitle || d.appliedPositionTitle || 'General Application'}</span>
                        {(d.preferredInstitution || app.institutionPreference) && (
                          <span className="text-slate-400 font-normal">({d.preferredInstitution || app.institutionPreference})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    {/* Status Pill & Select */}
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updatingId === app.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${statusConfig.bg}`}
                    >
                      <option value="new">New Application</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview Scheduled</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => handlePrintIndividualSlip(app)}
                      title="Print or Save Individual PDF Dossier"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Printer size={13} />
                      <span className="hidden sm:inline">Print Slip</span>
                    </button>

                    <button
                      onClick={() => handleDelete(app.id)}
                      title="Delete Application Permanently"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Candidate Key Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Contact</span>
                    <a href={`tel:${app.phone}`} className="font-bold text-slate-800 hover:text-emerald-700 block mt-0.5">
                      {app.phone}
                    </a>
                    <a href={`mailto:${app.email}`} className="text-emerald-600 truncate block mt-0.5" title={app.email}>
                      {app.email}
                    </a>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Category & Caste</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {d.category || 'Open / General'}
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      {d.caste ? `Caste: ${d.caste}` : '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Gender & Age</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {d.gender || '-'} {d.age ? `• ${d.age} Yrs` : ''}
                    </span>
                    <span className="text-slate-500 block mt-0.5">
                      DOB: {d.dob || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Qualification</span>
                    <span className="font-bold text-slate-800 block mt-0.5 truncate" title={highestQual ? `${highestQual.degree || highestQual.exam}` : ''}>
                      {highestQual ? `${highestQual.degree || highestQual.exam}` : 'Not Specified'}
                    </span>
                    <span className="text-emerald-700 font-semibold block mt-0.5">
                      {highestQual?.percentage ? `${highestQual.percentage}%` : (d.netQualified ? 'NET Qualified' : '')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Experience</span>
                    <span className="font-bold text-slate-800 block mt-0.5">
                      {d.totalExperienceYears ? `${d.totalExperienceYears} Years` : (d.currentDesignation || 'Fresher')}
                    </span>
                    <span className="text-slate-500 truncate block mt-0.5" title={d.currentOrganization}>
                      {d.currentOrganization || '-'}
                    </span>
                  </div>
                </div>

                {/* Attachments & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Resume Download */}
                    {(app.resumeUrl || d.resumeUrl) && (
                      <a
                        href={getDownloadUrl(app.resumeUrl || d.resumeUrl, app.resumeOriginalName || d.resumeOriginalName)}
                        download={app.resumeOriginalName || d.resumeOriginalName || `${app.name}_Resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <FileText size={13} />
                        <span>Download Resume</span>
                      </a>
                    )}

                    {/* Educational Certificates */}
                    {(d.documentsUrl || app.documentsUrl) && (
                      <a
                        href={getDownloadUrl(d.documentsUrl || app.documentsUrl, d.documentsOriginalName || app.documentsOriginalName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Paperclip size={13} />
                        <span>View Certificates</span>
                      </a>
                    )}

                    {/* Photo */}
                    {(d.photoUrl || app.photoUrl) && (
                      <a
                        href={getDownloadUrl(d.photoUrl || app.photoUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <ImageIcon size={13} />
                        <span>Passport Photo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      Applied: {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setAdminNotes(app.adminNotes || '');
                      }}
                      className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye size={14} /> View Full Dossier
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Individual Candidate Dossier Modal */}
      {selectedApp && (() => {
        const d = (typeof selectedApp.details === 'object' && selectedApp.details !== null && Object.keys(selectedApp.details).length > 0) ? { ...selectedApp, ...selectedApp.details } : selectedApp;
        const qualList = Array.isArray(d.qualifications) ? d.qualifications : (Array.isArray(selectedApp.qualifications) ? selectedApp.qualifications : []);
        const expList = Array.isArray(d.experience) ? d.experience : (Array.isArray(d.experiences) ? d.experiences : (Array.isArray(selectedApp.experience) ? selectedApp.experience : []));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-200 flex flex-col">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-950 to-slate-900 text-white sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 font-bold text-amber-400 text-xl font-serif">
                    {d.photoUrl || selectedApp.photoUrl ? (
                      <img src={d.photoUrl || selectedApp.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                    ) : (
                      (selectedApp.name || 'C').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{selectedApp.name}</h3>
                      {(d.candidateNameMarathi || selectedApp.nameMarathi) && (
                        <span className="text-xs text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                          {d.candidateNameMarathi || selectedApp.nameMarathi}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-emerald-200 mt-1">
                      Application ID: <span className="font-mono text-amber-300 font-bold">{d.applicationNumber || selectedApp.applicationNumber || `SSM-${selectedApp.id}`}</span>
                      {' • '}Applied Post: <strong className="text-white">{selectedApp.jobTitle || d.appliedPositionTitle || 'General Application'}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrintIndividualSlip(selectedApp)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer size={15} /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-6 text-slate-800 text-xs">
                {/* Section 1: Personal & Identity Details */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                    1. Personal & Identity Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Father's / Husband's Name</span>
                      <span className="font-bold text-slate-800">{d.fatherHusbandName || d.fatherOrHusbandName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Mother's Name</span>
                      <span className="font-bold text-slate-800">{d.motherName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth & Age</span>
                      <span className="font-bold text-slate-800">{d.dob || '-'} ({d.age ? `${d.age} Yrs` : '-'})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender & Blood Group</span>
                      <span className="font-bold text-slate-800">{d.gender || '-'} • {d.bloodGroup || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Social Category</span>
                      <span className="font-bold text-emerald-800">{d.category || 'Open / General'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Caste & Sub-Caste</span>
                      <span className="font-bold text-slate-800">{d.caste || d.casteName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Aadhaar Number</span>
                      <span className="font-mono font-bold text-slate-800">{d.aadhaarNo || d.aadhaar || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">PAN Number</span>
                      <span className="font-mono font-bold text-slate-800">{d.panNo || d.pan || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Marital Status</span>
                      <span className="font-bold text-slate-800">{d.maritalStatus || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Persons with Disability</span>
                      <span className="font-bold text-slate-800">
                        {d.isHandicapped || d.pwd === 'Yes' ? `Yes (${d.handicappedNature || d.pwdType || ''} ${d.handicappedPercent || ''}%)` : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution Preference</span>
                      <span className="font-bold text-emerald-800">{d.preferredInstitution || d.institutionPreference || 'Any Institution'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Department / Subject</span>
                      <span className="font-bold text-slate-800">{d.appliedDepartment || d.specialization || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact Details */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                    2. Contact & Address Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Mobile</span>
                      <a href={`tel:${selectedApp.phone}`} className="font-bold text-emerald-700">{selectedApp.phone}</a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Alternate Mobile</span>
                      <span className="font-bold text-slate-800">{d.altMobile || d.alternatePhone || '-'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                      <a href={`mailto:${selectedApp.email}`} className="font-bold text-emerald-700">{selectedApp.email}</a>
                    </div>
                    <div className="md:col-span-4">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Correspondence Address</span>
                      <span className="font-bold text-slate-800">
                        {d.corrAddress || d.correspondenceAddress || d.address || '-'}, Taluka: {d.corrTaluka || d.city || '-'}, Dist: {d.corrDistrict || d.district || '-'}, State: {d.corrState || d.state || 'Maharashtra'} - PIN: {d.corrPinCode || d.pincode || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Educational Qualifications Table */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                    3. Educational Qualifications
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-emerald-950 text-white text-[11px] font-bold uppercase">
                          <th className="p-3">Examination</th>
                          <th className="p-3">Degree / Branch</th>
                          <th className="p-3">Board / University</th>
                          <th className="p-3">Year</th>
                          <th className="p-3">Marks</th>
                          <th className="p-3">% / CGPA</th>
                          <th className="p-3">Division</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {qualList.length > 0 ? (
                          qualList.map((q: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{q.exam}</td>
                              <td className="p-3">{q.degree || '-'}</td>
                              <td className="p-3">{q.boardUniversity || '-'}</td>
                              <td className="p-3">{q.passingYear || '-'}</td>
                              <td className="p-3">{q.marksObtained ? `${q.marksObtained}/${q.totalMarks}` : '-'}</td>
                              <td className="p-3 font-bold text-emerald-700">{q.percentage ? `${q.percentage}%` : '-'}</td>
                              <td className="p-3">{q.divisionGrade || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-slate-400">
                              No academic records provided.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Additional Exam details */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">NET / SET / GATE:</span>{' '}
                      <span className="font-bold text-slate-800">
                        {[
                          d.netQualified ? `NET Qualified (${d.netYear || ''})` : null,
                          d.setQualified ? `SET Qualified (${d.setYear || ''})` : null,
                          d.gateQualified ? `GATE (${d.gateYear || ''})` : null
                        ].filter(Boolean).join(' • ') || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Ph.D. Degree:</span>{' '}
                      <span className="font-bold text-slate-800">
                        {d.phdAwarded ? `Awarded in ${d.phdYear || ''} (${d.phdSubject || ''}, ${d.phdUniversity || ''})` : 'Not Awarded'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Work & Teaching Experience Table */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                    4. Professional & Teaching Experience
                  </h4>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-emerald-950 text-white text-[11px] font-bold uppercase">
                          <th className="p-3">Organization</th>
                          <th className="p-3">Designation</th>
                          <th className="p-3">Nature</th>
                          <th className="p-3">From</th>
                          <th className="p-3">To</th>
                          <th className="p-3">Period</th>
                          <th className="p-3">Pay Scale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {expList.length > 0 ? (
                          expList.map((e: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900">{e.organization}</td>
                              <td className="p-3">{e.designation || '-'}</td>
                              <td className="p-3">{e.nature || '-'}</td>
                              <td className="p-3">{e.fromDate || '-'}</td>
                              <td className="p-3">{e.toDate || '-'}</td>
                              <td className="p-3 font-medium">{e.totalPeriod || '-'}</td>
                              <td className="p-3">{e.payScale || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-slate-400">
                              No prior experience records provided (Fresher).
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 5: Uploaded Files & Attachments */}
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                    5. Uploaded Files & Dossier Documents
                  </h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {/* Resume */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Detailed Resume / CV</span>
                        <p className="text-xs font-bold text-slate-800 truncate mb-2">
                          {d.resumeOriginalName || selectedApp.resumeOriginalName || 'Candidate_Resume.pdf'}
                        </p>
                      </div>
                      {(d.resumeUrl || selectedApp.resumeUrl) ? (
                        <a
                          href={getDownloadUrl(d.resumeUrl || selectedApp.resumeUrl, d.resumeOriginalName || selectedApp.resumeOriginalName)}
                          download={d.resumeOriginalName || selectedApp.resumeOriginalName || `${selectedApp.name}_Resume.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Download size={13} /> Download Resume
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not provided</span>
                      )}
                    </div>

                    {/* Educational Certificates */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Certificates / Marksheets</span>
                        <p className="text-xs font-bold text-slate-800 truncate mb-2">
                          {d.documentsOriginalName || selectedApp.documentsOriginalName || 'Academic_Certificates.pdf'}
                        </p>
                      </div>
                      {(d.documentsUrl || selectedApp.documentsUrl) ? (
                        <a
                          href={getDownloadUrl(d.documentsUrl || selectedApp.documentsUrl, d.documentsOriginalName || selectedApp.documentsOriginalName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Paperclip size={13} /> View Certificates
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not provided</span>
                      )}
                    </div>

                    {/* Passport Photo */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Passport Photograph</span>
                        <p className="text-xs font-bold text-slate-800 truncate mb-2">
                          {d.photoUrl || selectedApp.photoUrl ? 'Candidate Photograph' : 'None'}
                        </p>
                      </div>
                      {(d.photoUrl || selectedApp.photoUrl) ? (
                        <a
                          href={getDownloadUrl(d.photoUrl || selectedApp.photoUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ImageIcon size={13} /> View Photo
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 6: Cover Letter & Research */}
                {(d.coverLetter || selectedApp.coverLetter) && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 border-b border-slate-200 pb-2 mb-3">
                      6. Candidate Statement / Cover Letter
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {d.coverLetter || selectedApp.coverLetter}
                    </div>
                  </div>
                )}

                {/* Section 7: Scrutiny Status & Admin Notes */}
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-700" />
                    Committee Scrutiny & Interview Decision
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Recruitment Pipeline Status
                      </label>
                      <select
                        value={selectedApp.status || 'new'}
                        onChange={(e) => handleStatusChange(selectedApp.id, e.target.value, adminNotes)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
                      >
                        <option value="new">New Application</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted for Scrutiny</option>
                        <option value="interview">Interview Scheduled</option>
                        <option value="selected">Selected for Appointment</option>
                        <option value="rejected">Rejected / Ineligible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Administrative & Committee Remarks
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Enter verification notes, interview marks, or remarks..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-600"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedApp.id, selectedApp.status || 'new', adminNotes)}
                      disabled={updatingId === selectedApp.id}
                      className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Save size={14} /> Save Scrutiny Remarks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries()
      .then((data) => {
        setInquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Inquiries & Messages</h2>
      {loading ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
          Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
          No inquiries received yet. Messages sent via the website contact form will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq: any) => (
            <div key={inq.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{inq.name}</h3>
                  <span className="inline-block mt-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {inq.program || "General Inquiry"}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {inq.created_at ? new Date(inq.created_at).toLocaleString() : ""}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-slate-400 block text-xs mb-1">Email Address</span>
                  <a href={`mailto:${inq.email}`} className="text-emerald-600 hover:underline font-medium">
                    {inq.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs mb-1">Phone Number</span>
                  <a href={`tel:${inq.phone}`} className="text-slate-700 hover:underline font-medium">
                    {inq.phone || "N/A"}
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <span className="text-slate-400 block mb-1 text-xs uppercase font-bold tracking-wider">
                  Message Content
                </span>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{inq.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryManager() {
  const { confirm } = useConfirm();
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [galleryKeys, setGalleryKeys] = useState<string[]>([]);

  useEffect(() => {
    fetchContentBlocks().then(data => {
      setBlocks(data);
      // Find all gallery keys
      let keys = Object.keys(data).filter(k => k.startsWith('Gallery_Image')).sort();
      if (keys.length === 0) {
        keys = ['Gallery_Image1', 'Gallery_Image2', 'Gallery_Image3', 'Gallery_Image4', 'Gallery_Image5'];
      }
      setGalleryKeys(keys);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await Promise.all(galleryKeys.map(key => saveContentBlock(key, blocks[key] || '')));
      setSuccessMsg('Successfully saved all gallery images.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, val: string) => {
    setBlocks(prev => ({ ...prev, [key]: val }));
  };

  const addImage = () => {
    setGalleryKeys(prev => {
      const nextNum = prev.length > 0 ? Math.max(...prev.map(k => parseInt(k.replace('Gallery_Image', '') || '0'))) + 1 : 1;
      return [...prev, `Gallery_Image${nextNum}`];
    });
  };

  const deleteImage = async (keyToDelete: string) => {
    if (await confirm({ title: 'Remove Image', message: 'Are you sure you want to remove this image field?' })) {
      // If we want to actually delete from DB, we'd need a deleteContentBlock function,
      // but setting to empty string and hiding it is fine too, or we can just filter it.
      // Assuming empty string hides it in frontend.
      setBlocks(prev => ({ ...prev, [keyToDelete]: '' }));
      await saveContentBlock(keyToDelete, '');
      setGalleryKeys(prev => prev.filter(k => k !== keyToDelete));
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Gallery Images</h1>
          <p className="text-slate-500">Update the images shown in the campus gallery.</p>
        </div>
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-emerald-100 shadow-sm">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100">
        {galleryKeys.map((key, index) => (
          <div key={key} className="mb-8 relative border-b border-slate-100 pb-8 last:border-0 last:pb-0">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Image {index + 1}</label>
              {galleryKeys.length > 1 && (
                <button type="button" onClick={() => deleteImage(key)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1">
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
            <ImageUploader label="" value={blocks[key] || ''} onChange={(newVal) => handleFieldChange(key, newVal)} />
          </div>
        ))}
        
        <div className="flex justify-center mt-6">
          <button type="button" onClick={addImage} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 border border-slate-300 border-dashed">
            <Plus size={16} /> Add New Image
          </button>
        </div>

        <div className="pt-6 mt-8 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2">
            {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Gallery'}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminInner() {

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [authError, setAuthError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email, role: payload.role || 'admin' });
      } catch {
        setUser({ email: 'Admin', role: 'admin' });
      }
      setIsAdmin(true);
    } else {
      setUser(null);
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const u = await login(email.trim(), password.trim());
      setUser(u);
      setIsAdmin(true);
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAdmin(false);
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin w-8 h-8 border-4 border-emerald-900 border-t-transparent rounded-full"></div></div>;

    if (!user || !isAdmin) {
    return (
      <div className="min-h-screen w-full flex bg-white font-sans selection:bg-emerald-900 selection:text-white">
        {/* Left Side - Visual/Branding */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-emerald-950">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000" 
              alt="Campus" 
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/50 to-transparent" />
          </div>
          
          <div className="relative z-10 flex flex-col justify-between w-full h-full p-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-sm flex items-center justify-center text-emerald-950 font-bold font-serif text-xl">
                S
              </div>
              <span className="text-white font-serif font-bold text-xl tracking-wider">SSM PORTAL</span>
            </div>
            
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-amber-500"></div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em]">
                  Secure Access
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
                Manage your institution's digital presence.
              </h1>
              <p className="text-emerald-100/70 text-lg font-light leading-relaxed">
                Welcome to the centralized administration dashboard for Sarvodaya Shikshan Mandal. Please authenticate to continue.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-slate-50 relative">
          
          {/* Mobile Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-emerald-950 rounded-lg flex items-center justify-center text-amber-500 font-bold font-serif text-2xl shadow-lg">
              S
            </div>
            <span className="text-emerald-950 font-serif font-bold text-2xl tracking-wider">SSM PORTAL</span>
          </div>

          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold text-sm mb-12 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
              <ArrowLeft size={16} /> Return to Homepage
            </Link>
            <div className="mb-10 text-left">
              <h2 className="text-3xl font-serif font-bold text-emerald-950 mb-3">Welcome Back</h2>
              <p className="text-slate-500">Enter your credentials to access the admin dashboard.</p>
            </div>

            {authError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md mb-8 flex items-start gap-3">
                <Shield className="text-red-500 shrink-0 mt-0.5" size={16} />
                <div className="text-red-700 text-sm font-medium">{authError}</div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-6 text-sm text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block mb-1">Standard Admin Credentials:</span>
                  <div className="text-xs text-emerald-800 space-x-3">
                    <span>User: <strong className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded">admin</strong></span>
                    <span>Password: <strong className="font-mono bg-emerald-100/80 px-1 py-0.5 rounded">admin</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setEmail('admin'); setPassword('admin'); }}
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3 py-1.5 rounded shadow-sm transition-colors"
                >
                  Auto-fill
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700 placeholder-slate-400 font-medium"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700 placeholder-slate-400 font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">Remember me for 30 days</label>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group mt-8 shadow-lg shadow-emerald-950/20"
              >
                Sign In to Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            
            <div className="mt-12 text-center text-xs font-medium text-slate-400">
              <p>&copy; {new Date().getFullYear()} Sarvodaya Shikshan Mandal. All rights reserved.</p>
              <p className="mt-1">Secured by AES-256 Encryption</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-100 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col shadow-2xl z-30 transform transition-transform duration-300 ease-in-out lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 pb-2 flex flex-col items-center text-center relative">
          <button 
            className="lg:hidden absolute top-4 right-4 text-emerald-400 hover:text-white bg-emerald-900/50 p-2 rounded-full"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl mb-3 shadow-md">
            S
          </div>
          <h2 className="text-base font-semibold text-white tracking-wide">SSM Admin</h2><p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">Control Panel</p>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar px-2 space-y-0.5">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-2">Main Menu</div>
          <Link to="/admin" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname === '/admin' ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={16} /> <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link to="/admin/announcements" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/announcements') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Megaphone size={16} /> <span className="font-medium text-sm">Announcements</span>
          </Link>
          <Link to="/admin/events" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/events') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <CalendarIcon size={16} /> <span className="font-medium text-sm">Events Calendar</span>
          </Link>
          <Link to="/admin/applications" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/applications') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <FileSpreadsheet size={16}  /> 
            <span className="font-medium text-sm">Job Applications</span>
          </Link>
          <Link to="/admin/careers" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/careers') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Briefcase size={16}  /> 
            <span className="font-medium text-sm">Careers & Ad PDF</span>
          </Link>
          <Link to="/admin/inquiries" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/inquiries') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Mail size={16} /> <span className="font-medium text-sm">Contact Inquiries</span>
          </Link>
          <Link to="/admin/alumni" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/alumni') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <GraduationCap size={16} /> <span className="font-medium text-sm">Alumni Network</span>
          </Link>
          <Link to="/admin/institutions" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/institutions') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Building size={16} /> <span className="font-medium text-sm">Institutions</span>
          </Link>
          
          <div className="px-3 py-1.5 mt-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-2">Website Content</div>
          
          <Link to="/admin/branding" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/branding') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <ImageIcon size={16} /> <span className="font-medium text-sm">Branding & Footer</span>
          </Link>
          <Link to="/admin/contact" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/contact') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Phone size={16} /> <span className="font-medium text-sm">Contact Info</span>
          </Link>
          <Link to="/admin/homepage" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/homepage') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Home size={16} /> <span className="font-medium text-sm">Homepage Hero</span>
          </Link>
          <Link to="/admin/about" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/about') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Info size={16} /> <span className="font-medium text-sm">About & Vision</span>
          </Link>

          
          <Link to="/admin/adminstaff" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/adminstaff') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Building size={16} /> <span className="font-medium text-sm">Admin & Support Staff</span>
          </Link>
          <Link to="/admin/management" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/management') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={16} /> <span className="font-medium text-sm">Board of Directors (कार्यकारिणी)</span>
          </Link>
          <Link to="/admin/stats" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/stats') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <BarChart size={16} /> <span className="font-medium text-sm">Impact Statistics</span>
          </Link>
          <Link to="/admin/gallery" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/gallery') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <ImageIcon size={16} /> <span className="font-medium text-sm">Gallery Images</span>
          </Link>
          <Link to="/admin/testimonials" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname.includes('/testimonials') ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={16} /> <span className="font-medium text-sm">Testimonials</span>
          </Link>
          <Link to="/admin/content" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname === '/admin/content' ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Settings size={16} /> <span className="font-medium text-sm">All Raw Blocks</span>
          </Link>
          {user.role === 'master' && (
            <Link to="/admin/users" className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${location.pathname === '/admin/users' ? 'bg-white/10 text-white font-medium shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <Shield size={16} /> <span className="font-medium text-sm">User Management</span>
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs">
              <span className="text-xs font-bold text-amber-400">{user.email.substring(0, 1).toUpperCase()}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-slate-300 truncate font-medium">{user.email}</p>
              <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">
                {user.role === 'master' ? 'Master Admin' : 'Administrator'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors font-bold text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm shrink-0 z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-emerald-950 font-serif font-bold text-lg shadow-sm">
              S
            </div>
            <h1 className="text-lg font-serif font-bold text-emerald-950">SSM Portal</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
          <Route path="/" element={
            <div className="max-w-5xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-slate-800 mb-1">Admin Dashboard</h1>
                  <p className="text-slate-500 font-medium text-sm">Overview of your institution's digital presence.</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Online
                </div>
              </div>
                
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                      <Megaphone size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-0.5">Live</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Announcements</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <Building size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-0.5">15+</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institutions Managed</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <CalendarIcon size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-0.5">Updated</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Calendar</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950 rounded-xl p-5 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-5 opacity-10">
                  <Settings size={80} />
                </div>
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-lg font-serif font-bold text-white mb-2">Quick Start Guide</h2>
                  <p className="text-emerald-100/80 mb-4 text-sm leading-relaxed">
                    Use the sidebar on the left to navigate through the different sections of your website. You can update text, manage your organization's statistics, and upload photos instantly.
                  </p>
                  <div className="flex gap-3">
                    <Link to="/admin/branding" className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                      Update Logo
                    </Link>
                    <Link to="/admin/homepage" className="bg-emerald-900/50 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-emerald-800">
                      Edit Homepage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/announcements" element={<AnnouncementsManager />} />
          <Route path="/events" element={<EventsManager />} />
          <Route path="/applications" element={<JobApplicationsAdmin />} />
          <Route path="/inquiries" element={<InquiriesAdmin />} />
          <Route path="/alumni" element={<AlumniAdmin />} />
          <Route path="/users" element={<AdminsManager />} />
          <Route path="/careers" element={<CareersAdmin />} />
          <Route path="/institutions" element={<InstitutionsManager />} />
          <Route path="/institution-content/:id" element={<InstitutionContentWrapper />} />
          <Route path="/content" element={<ContentBlocksManager sectionTitle="All Raw Content Blocks" />} />
          <Route path="/branding" element={<ContentBlocksManager sectionTitle="Branding & Site Setup" filterKeys={['Org_ShortName', 'Org_Name_Mr', 'Org_Name_En', 'Org_Subtitle_Mr', 'Org_Subtitle_En', 'Org_Location', 'Org_Est', 'Org_Logo_URL', 'Nav_About_Mr', 'Nav_About_En', 'Nav_Institutions_Mr', 'Nav_Institutions_En', 'Nav_Media_Mr', 'Nav_Media_En', 'Nav_Careers_Mr', 'Nav_Careers_En', 'Nav_Alumni_Mr', 'Nav_Alumni_En', 'Nav_Alumni_URL', 'Nav_StudentPortal_Mr', 'Nav_StudentPortal_En', 'Nav_StudentPortal_URL', 'Footer_Name', 'Footer_Copyright']} />} />
          <Route path="/contact" element={<ContentBlocksManager sectionTitle="Contact & Social Links" filterKeys={['Contact_Title_Mr', 'Contact_Title_En', 'Contact_Description_Mr', 'Contact_Description_En', 'Contact_Phone', 'Contact_LibraryPhone', 'Contact_Email', 'Contact_Address_Mr', 'Contact_Address_En', 'Contact_Map_URL', 'Social_Facebook', 'Social_Twitter', 'Social_Instagram', 'Social_LinkedIn', 'Social_YouTube', 'Social_WhatsApp']} />} />
          <Route path="/homepage" element={<ContentBlocksManager sectionTitle="Homepage Headers" filterKeys={['Hero_PreTitle_Mr', 'Hero_PreTitle_En', 'Hero_Title_Mr', 'Hero_Title_En', 'Hero_Description_Mr', 'Hero_Description_En', 'Hero_Background_Image', 'Leadership_Title_Mr', 'Leadership_Title_En', 'Institutions_Title_Mr', 'Institutions_Title_En', 'Media_Title_Mr', 'Media_Title_En', 'Careers_Title_Mr', 'Careers_Title_En', 'Careers_PreTitle_Mr', 'Careers_PreTitle_En', 'Careers_Desc_Mr', 'Careers_Desc_En', 'Careers_No_Openings_Mr', 'Careers_No_Openings_En', 'Careers_Email']} />} />
          
          <Route path="/president" element={<ContentBlocksManager sectionTitle="President's Message" filterKeys={['President_Name_Mr', 'President_Name_En', 'President_Title_Mr', 'President_Title_En', 'President_Image', 'President_Quote_Mr', 'President_Quote_En', 'President_Text_Mr', 'President_Text_En']} />} />
          <Route path="/secretary" element={<ContentBlocksManager sectionTitle="Secretary's Message" filterKeys={['Secretary_Name_Mr', 'Secretary_Name_En', 'Secretary_Title_Mr', 'Secretary_Title_En', 'Secretary_Image', 'Secretary_Quote_Mr', 'Secretary_Quote_En', 'Secretary_Text_Mr', 'Secretary_Text_En']} />} />
          <Route path="/working-president" element={<ContentBlocksManager sectionTitle="Working President Message" filterKeys={['WorkingPresident_Name_Mr', 'WorkingPresident_Name_En', 'WorkingPresident_Title_Mr', 'WorkingPresident_Title_En', 'WorkingPresident_Image', 'WorkingPresident_Quote_Mr', 'WorkingPresident_Quote_En', 'WorkingPresident_Text_Mr', 'WorkingPresident_Text_En']} />} />
          <Route path="/vice-president" element={<ContentBlocksManager sectionTitle="Vice Presidents' Messages" filterKeys={['VicePresident1_Name_Mr', 'VicePresident1_Name_En', 'VicePresident1_Title_Mr', 'VicePresident1_Title_En', 'VicePresident1_Image', 'VicePresident1_Text_Mr', 'VicePresident1_Text_En', 'VicePresident2_Name_Mr', 'VicePresident2_Name_En', 'VicePresident2_Title_Mr', 'VicePresident2_Title_En', 'VicePresident2_Image', 'VicePresident2_Text_Mr', 'VicePresident2_Text_En']} />} />
          <Route path="/joint-secretary" element={<ContentBlocksManager sectionTitle="Joint Secretary Message" filterKeys={['JointSecretary_Name_Mr', 'JointSecretary_Name_En', 'JointSecretary_Title_Mr', 'JointSecretary_Title_En', 'JointSecretary_Image', 'JointSecretary_Quote_Mr', 'JointSecretary_Quote_En', 'JointSecretary_Text_Mr', 'JointSecretary_Text_En']} />} />
          <Route path="/treasurer" element={<ContentBlocksManager sectionTitle="Treasurer Message" filterKeys={['Treasurer_Name_Mr', 'Treasurer_Name_En', 'Treasurer_Title_Mr', 'Treasurer_Title_En', 'Treasurer_Image', 'Treasurer_Quote_Mr', 'Treasurer_Quote_En', 'Treasurer_Text_Mr', 'Treasurer_Text_En']} />} />
          <Route path="/adminstaff" element={<ContentBlocksManager sectionTitle="Administrative Office & Staff" filterKeys={['AdminStaff_Section_Title', 'AdminStaff_Section_Desc', 'AdminStaff_Profile1_Name', 'AdminStaff_Profile1_Title', 'AdminStaff_Profile1_Image', 'AdminStaff_Profile1_Desc', 'AdminStaff_Profile1_Phone', 'AdminStaff_Profile1_Email', 'AdminStaff_Profile2_Name', 'AdminStaff_Profile2_Title', 'AdminStaff_Profile2_Image', 'AdminStaff_Profile2_Desc', 'AdminStaff_Profile2_Phone', 'AdminStaff_Profile2_Email', 'AdminStaff_Profile3_Name', 'AdminStaff_Profile3_Title', 'AdminStaff_Profile3_Image', 'AdminStaff_Profile3_Desc', 'AdminStaff_Profile3_Phone', 'AdminStaff_Profile3_Email', 'AdminStaff_Profile4_Name', 'AdminStaff_Profile4_Title', 'AdminStaff_Profile4_Image', 'AdminStaff_Profile4_Desc', 'AdminStaff_Profile4_Phone', 'AdminStaff_Profile4_Email', 'AdminStaff_Profile5_Name', 'AdminStaff_Profile5_Title', 'AdminStaff_Profile5_Image', 'AdminStaff_Profile5_Desc', 'AdminStaff_Profile5_Phone', 'AdminStaff_Profile5_Email', 'AdminStaff_Profile6_Name', 'AdminStaff_Profile6_Title', 'AdminStaff_Profile6_Image', 'AdminStaff_Profile6_Desc', 'AdminStaff_Profile6_Phone', 'AdminStaff_Profile6_Email', 'AdminStaff_Profile7_Name', 'AdminStaff_Profile7_Title', 'AdminStaff_Profile7_Image', 'AdminStaff_Profile7_Desc', 'AdminStaff_Profile7_Phone', 'AdminStaff_Profile7_Email', 'AdminStaff_Profile8_Name', 'AdminStaff_Profile8_Title', 'AdminStaff_Profile8_Image', 'AdminStaff_Profile8_Desc', 'AdminStaff_Profile8_Phone', 'AdminStaff_Profile8_Email']} />} />
          <Route path="/about" element={<ContentBlocksManager sectionTitle="About Us, Founder & Vision" filterKeys={['About_Title', 'About_Title_Mr', 'About_Paragraph', 'About_Paragraph_Mr', 'About_Image', 'Founder_Image', 'Founder_Bio_En', 'Founder_Bio_Mr', 'Vision_Title', 'Vision_Desc', 'Vision_Text', 'Mission_Title', 'Mission_Desc', 'Mission_Text']} />} />
          <Route path="/management" element={<BoardOfDirectorsManager />} />
          <Route path="/stats" element={<ContentBlocksManager sectionTitle="Impact Statistics" filterKeys={['Stat1_Value', 'Stat1_Label', 'Stat2_Value', 'Stat2_Label', 'Stat3_Value', 'Stat3_Label', 'Stat4_Value', 'Stat4_Label']} />} />
          <Route path="/gallery" element={<GalleryManager />} />
          <Route path="/testimonials" element={<ContentBlocksManager sectionTitle="Testimonials" filterKeys={['Testimonial1_Text_Mr', 'Testimonial1_Text_En', 'Testimonial1_Name_Mr', 'Testimonial1_Name_En', 'Testimonial1_Title_Mr', 'Testimonial1_Title_En', 'Testimonial1_Image', 'Testimonial2_Text_Mr', 'Testimonial2_Text_En', 'Testimonial2_Name_Mr', 'Testimonial2_Name_En', 'Testimonial2_Title_Mr', 'Testimonial2_Title_En', 'Testimonial2_Image', 'Testimonial3_Text_Mr', 'Testimonial3_Text_En', 'Testimonial3_Name_Mr', 'Testimonial3_Name_En', 'Testimonial3_Title_Mr', 'Testimonial3_Title_En', 'Testimonial3_Image']} />} />
          <Route path="/admissions" element={<ContentBlocksManager sectionTitle="Admissions & Programs" filterKeys={['Admissions_PreTitle_Mr', 'Admissions_PreTitle_En', 'Admissions_MainTitle_Mr', 'Admissions_MainTitle_En', 'Admissions_Title_Mr', 'Admissions_Title_En', 'Admissions_Step1_Title_Mr', 'Admissions_Step1_Title_En', 'Admissions_Step1_Desc_Mr', 'Admissions_Step1_Desc_En', 'Admissions_Step2_Title_Mr', 'Admissions_Step2_Title_En', 'Admissions_Step2_Desc_Mr', 'Admissions_Step2_Desc_En', 'Admissions_Step3_Title_Mr', 'Admissions_Step3_Title_En', 'Admissions_Step3_Desc_Mr', 'Admissions_Step3_Desc_En', 'Scholarships_Title_Mr', 'Scholarships_Title_En', 'Scholarships_Desc_Mr', 'Scholarships_Desc_En', 'Scholarships_List_Mr', 'Scholarships_List_En']} />} />
        </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

// AnnouncementsManager
function AnnouncementsManager() {
  const { confirm } = useConfirm();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  
  // Attachment state (PDF or JPG)
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentOriginalName, setAttachmentOriginalName] = useState('');
  const [attachmentType, setAttachmentType] = useState<'pdf' | 'image'>('pdf');
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: string; text: string }>({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAnnouncements()
      .then(data => { setAnnouncements(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDate('');
    setIsActive(true);
    setOrder(0);
    setAttachmentUrl('');
    setAttachmentOriginalName('');
    setAttachmentType('pdf');
    setCurrentId(null);
    setIsEditing(false);
    setUploadMsg({ type: '', text: '' });
  };

  const handleEdit = (ann: any) => {
    setTitle(ann.title || '');
    setContent(ann.content || ann.title || '');
    setDate(ann.date || '');
    setIsActive(ann.isNew ?? ann.is_new ?? true);
    setOrder(ann.order || ann.display_order || 0);
    setAttachmentUrl(ann.attachmentUrl || '');
    setAttachmentOriginalName(ann.attachmentOriginalName || '');
    const isPdf = ann.attachmentType === 'pdf' || (ann.attachmentUrl && ann.attachmentUrl.toLowerCase().endsWith('.pdf'));
    setAttachmentType(isPdf ? 'pdf' : 'image');
    setCurrentId(ann.id);
    setIsEditing(true);
    setUploadMsg({ type: '', text: '' });
  };

  const handleDelete = async (id: string) => {
    if (await confirm({ title: 'Delete Announcement', message: 'Are you sure you want to delete this announcement?' })) {
      try {
        await deleteAnnouncement(id);
        setAnnouncements(await fetchAnnouncements());
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isPdf && !isImage) {
      setUploadMsg({ type: 'error', text: 'Please select a valid PDF or JPG/PNG image file.' });
      return;
    }

    try {
      setUploadingAttachment(true);
      setUploadMsg({ type: 'info', text: 'Uploading document (PDF / JPG)...' });
      const res = await uploadAnnouncementAttachment(file);
      if (res.url) {
        setAttachmentUrl(res.url);
        setAttachmentOriginalName(res.originalName || file.name);
        setAttachmentType(res.fileType || (isPdf ? 'pdf' : 'image'));
        setUploadMsg({ type: 'success', text: `Document attached successfully: ${res.originalName || file.name}` });
      }
    } catch (err: any) {
      console.error(err);
      setUploadMsg({ type: 'error', text: err.message || 'Failed to upload document' });
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl('');
    setAttachmentOriginalName('');
    setAttachmentType('pdf');
    setUploadMsg({ type: 'info', text: 'Attachment removed.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      content: content.trim() || title.trim(),
      date: date.trim() || new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      isNew: isActive,
      order: Number(order) || 0,
      attachmentUrl: attachmentUrl || null,
      attachmentOriginalName: attachmentOriginalName || null,
      attachmentType: attachmentType || (attachmentUrl && attachmentUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
    };

    try {
      if (currentId) await updateAnnouncement(currentId, payload);
      else await saveAnnouncement(payload);
      resetForm();
      setAnnouncements(await fetchAnnouncements());
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAnnouncements = announcements.filter((ann: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (ann.title && ann.title.toLowerCase().includes(q)) ||
      (ann.content && ann.content.toLowerCase().includes(q)) ||
      (ann.attachmentOriginalName && ann.attachmentOriginalName.toLowerCase().includes(q))
    );
  });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading announcements...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Announcements & Circulars</h1>
          <p className="text-slate-500 text-sm">
            Manage scrolling announcements, news updates, and upload official PDF or JPG circulars for users to download.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { resetForm(); setIsEditing(true); }} 
            className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md shrink-0"
          >
            <Plus size={16} /> Add Announcement
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-4xl">
          <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {currentId ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <button 
              type="button" 
              onClick={resetForm} 
              className="text-slate-400 hover:text-slate-600 text-sm flex items-center gap-1"
            >
              <X size={16} /> Close Form
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Announcement Headline / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Admissions Open for Academic Year 2026-27 / प्रवेश प्रक्रिया २०२६-२७ सुरू"
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Description / Content */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Detailed Information / Content
              </label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide detailed information, eligibility, counseling guidelines or instructions for candidates and visitors..."
                className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                rows={4}
              ></textarea>
            </div>

            {/* PDF / JPG Attachment Upload Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <label className="block text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <Paperclip size={16} className="text-emerald-700" />
                Upload Official Circular / Notice Attachment (PDF or JPG / PNG)
              </label>
              <p className="text-xs text-slate-500 mb-4">
                Attach an official government order, admission circular, fee brochure, or event flyer. Users will be able to download this PDF or JPG directly from the website.
              </p>

              {attachmentUrl ? (
                <div className="bg-white border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${attachmentType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {attachmentType === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${attachmentType === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                          {attachmentType === 'pdf' ? 'PDF Document' : 'JPG Image'}
                        </span>
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Ready for Download
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 mt-1 truncate max-w-sm">
                        {attachmentOriginalName || 'Attached Document'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={getDownloadUrl(attachmentUrl, attachmentOriginalName)}
                      download={attachmentOriginalName || 'Announcement_Document'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Download and test file"
                    >
                      <Download size={14} /> Download / Test
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group">
                    <UploadCloud size={32} className="text-slate-400 group-hover:text-emerald-600 transition-colors mb-2" />
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">
                      {uploadingAttachment ? 'Uploading document...' : 'Click or drag PDF / JPG file to upload'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Supported: PDF, JPG, JPEG, PNG (Max 30MB)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf,.jpg,.jpeg,.png,image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingAttachment}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {uploadMsg.text && (
                <div className={`mt-3 text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                  uploadMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                  uploadMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {uploadMsg.type === 'error' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                  <span>{uploadMsg.text}</span>
                </div>
              )}
            </div>

            {/* Date, Order and Badge settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Publication Date / Month
                </label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. March 2026 / मार्च २०२६"
                  className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Display Order
                </label>
                <input 
                  type="number" 
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isActive" className="font-bold text-sm text-slate-700 cursor-pointer">
                  Show "NEW" / "नवीन" Badge
                </label>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={uploadingAttachment}
                className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2"
              >
                <Save size={16} /> {currentId ? 'Update Announcement' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          {/* Search bar & count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative max-w-sm w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search announcements or documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Total Announcements: <span className="text-emerald-900">{announcements.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600 font-bold">
                    <th className="p-4 w-16">Order</th>
                    <th className="p-4">Announcement Details</th>
                    <th className="p-4">Attached Document (PDF/JPG)</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Badge</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredAnnouncements.map((ann) => {
                    const hasAttachment = Boolean(ann.attachmentUrl);
                    const isPdf = ann.attachmentType === 'pdf' || (ann.attachmentUrl && ann.attachmentUrl.toLowerCase().endsWith('.pdf'));

                    return (
                      <tr key={ann.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-500">
                          {ann.order || ann.display_order || 0}
                        </td>
                        <td className="p-4 max-w-md">
                          <p className="font-bold text-slate-900 line-clamp-1 mb-0.5">
                            {ann.title}
                          </p>
                          {ann.content && ann.content !== ann.title && (
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {ann.content}
                            </p>
                          )}
                        </td>
                        <td className="p-4">
                          {hasAttachment ? (
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                                isPdf ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}>
                                {isPdf ? <FileText size={12} className="text-red-600" /> : <ImageIcon size={12} className="text-amber-600" />}
                                {isPdf ? 'PDF' : 'JPG'}
                              </span>
                              <a
                                href={getDownloadUrl(ann.attachmentUrl, ann.attachmentOriginalName)}
                                download={ann.attachmentOriginalName || 'Announcement'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
                                title="Download and inspect attachment"
                              >
                                <Download size={12} />
                                <span className="max-w-[120px] truncate">{ann.attachmentOriginalName || 'Download'}</span>
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">No document</span>
                          )}
                        </td>
                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {ann.date || '-'}
                        </td>
                        <td className="p-4 text-center">
                          {ann.isNew || ann.is_new ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-black tracking-wider">
                              NEW
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button 
                            onClick={() => handleEdit(ann)} 
                            className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded transition-colors mr-1"
                            title="Edit announcement"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(ann.id)} 
                            className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete announcement"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAnnouncements.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        {searchQuery ? 'No announcements match your search.' : 'No announcements found. Click "Add Announcement" to create one.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// EventsManager
function EventsManager() {
  const { confirm } = useConfirm();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchEvents().then(data => { setEvents(data); setLoading(false); }).catch(console.error);
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setDescription('');
    setOrder(0);
    setCurrentId(null);
    setIsEditing(false);
  };

  const handleEdit = (ev: any) => {
    setTitle(ev.title);
    setDate(ev.date);
    setDescription(ev.location);
    setOrder(ev.order || ev.display_order);
    setCurrentId(ev.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (await confirm({ title: 'Delete Event', message: 'Delete this event?' })) {
      try {
        await deleteEvent(id);
        setEvents(await fetchEvents());
      } catch (error) { console.error(error); }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title, date, location: description, month: '', order: Number(order) };
    try {
      if (currentId) await updateEvent(currentId, payload);
      else await saveEvent(payload);
      resetForm();
      setEvents(await fetchEvents());
    } catch (error) { console.error(error); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Events Calendar</h1><p className="text-slate-500">Manage upcoming college events.</p></div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Date (e.g., "15 Oct 2024")</label>
                <input type="text" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Location / Description</label>
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Order</label>
              <input type="number" required value={order} onChange={(e) => setOrder(parseInt(e.target.value))} className="w-24 border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b text-sm uppercase text-slate-500">
                <th className="p-4">Order</th>
                <th className="p-4">Title</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">{ev.order || ev.display_order}</td>
                  <td className="p-4">{ev.title}</td>
                  <td className="p-4">{ev.date}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(ev)} className="text-blue-600 p-1 mr-2"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(ev.id)} className="text-red-600 p-1"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


function InstitutionContentWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseInst = MANDAL_INSTITUTIONS.find((i) => String(i.id) === String(id));

  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with baseInst or content
  const [headImage, setHeadImage] = useState('');
  const [headNameMarathi, setHeadNameMarathi] = useState('');
  const [headNameEnglish, setHeadNameEnglish] = useState('');
  const [headTitle, setHeadTitle] = useState('');
  const [headQualifications, setHeadQualifications] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headQuote, setHeadQuote] = useState('');
  const [headMessage, setHeadMessage] = useState('');

  const [websiteLink, setWebsiteLink] = useState('');
  const [nameMarathi, setNameMarathi] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [category, setCategory] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [address, setAddress] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    fetchContentBlocks()
      .then((data) => {
        // data is already a Record<string, string>
        setContent(data || {});

        const map = data || {};
        // Pre-fill states
        setHeadImage(map[`Inst_${id}_HeadImage`] || baseInst?.headPhoto || '');
        setHeadNameMarathi(map[`Inst_${id}_HeadNameMarathi`] || baseInst?.headNameMarathi || '');
        setHeadNameEnglish(map[`Inst_${id}_HeadNameEnglish`] || baseInst?.headNameEnglish || '');
        setHeadTitle(map[`Inst_${id}_HeadTitle`] || (baseInst ? `${baseInst.headDesignationMarathi} (${baseInst.headDesignationEnglish})` : 'प्राचार्य (Principal)'));
        setHeadQualifications(map[`Inst_${id}_HeadQualifications`] || baseInst?.headQualifications || '');
        setHeadPhone(map[`Inst_${id}_HeadPhone`] || (baseInst?.phones && baseInst.phones[0]) || '');
        setHeadEmail(map[`Inst_${id}_HeadEmail`] || (baseInst?.emails && baseInst.emails[0]) || '');
        setHeadQuote(map[`Inst_${id}_HeadQuote`] || baseInst?.headQuote || '');
        setHeadMessage(map[`Inst_${id}_HeadMessage`] || baseInst?.headMessage || '');

        setWebsiteLink(map[`Inst_${id}_WebsiteLink`] || baseInst?.link || '');
        setNameMarathi(map[`Inst_${id}_NameMarathi`] || baseInst?.nameMarathi || '');
        setNameEnglish(map[`Inst_${id}_NameEnglish`] || baseInst?.nameEnglish || '');
        setCategory(map[`Inst_${id}_Category`] || baseInst?.category || 'College');
        setEstablishedYear(map[`Inst_${id}_EstYear`] || baseInst?.establishedYear || '');
        setAffiliation(map[`Inst_${id}_Affiliation`] || baseInst?.affiliation || '');
        setAddress(map[`Inst_${id}_Address`] || baseInst?.address || '');
        setAboutText(map[`Inst_${id}_AboutText`] || baseInst?.description || '');
        setBannerImage(map[`Inst_${id}_BannerImage`] || baseInst?.imageUrl || '');

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, baseInst]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const updates: Record<string, string> = {
        [`Inst_${id}_HeadImage`]: headImage,
        [`Inst_${id}_HeadName`]: headNameMarathi ? `${headNameMarathi} (${headNameEnglish})` : headNameEnglish,
        [`Inst_${id}_HeadNameMarathi`]: headNameMarathi,
        [`Inst_${id}_HeadNameEnglish`]: headNameEnglish,
        [`Inst_${id}_HeadTitle`]: headTitle,
        [`Inst_${id}_HeadQualifications`]: headQualifications,
        [`Inst_${id}_HeadPhone`]: headPhone,
        [`Inst_${id}_HeadEmail`]: headEmail,
        [`Inst_${id}_HeadQuote`]: headQuote,
        [`Inst_${id}_HeadMessage`]: headMessage,
        [`Inst_${id}_WebsiteLink`]: websiteLink,
        [`Inst_${id}_NameMarathi`]: nameMarathi,
        [`Inst_${id}_NameEnglish`]: nameEnglish,
        [`Inst_${id}_Category`]: category,
        [`Inst_${id}_EstYear`]: establishedYear,
        [`Inst_${id}_Affiliation`]: affiliation,
        [`Inst_${id}_Address`]: address,
        [`Inst_${id}_AboutText`]: aboutText,
        [`Inst_${id}_BannerImage`]: bannerImage,
      };

      await Promise.all(Object.entries(updates).map(([k, v]) => saveContentBlock(k, v)));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error(error);
      alert('Failed to save changes. Please check permissions.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-medium">
        Loading institution profile...
      </div>
    );
  }

  const displayName = nameMarathi || baseInst?.nameMarathi || `Institution #${id}`;

  return (
    <div className="max-w-5xl">
      {/* Header & Back Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
            <Link to="/admin/institutions" className="hover:underline flex items-center gap-1">
              <ArrowLeft size={14} /> Institutions Directory
            </Link>
            <span>/</span>
            <span className="text-slate-500">Edit Profile</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">
            {displayName}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            {nameEnglish || baseInst?.nameEnglish}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/institution/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
          >
            <ExternalLink size={14} /> View Live Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-3 text-sm font-bold shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          Institution details & Principal profile updated successfully! Changes are live on the website.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* =========================================================================
            CARD 1: PRINCIPAL / HEAD OF INSTITUTION (प्राचार्यांची माहिती व छायाचित्र)
           ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-amber-200/80 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-white">
                  Principal / Head of Institution (प्राचार्यांचे छायाचित्र व माहिती)
                </h2>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  Displayed prominently in the hero spotlight of this institution's dedicated page
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
              Leadership Spotlight
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Principal Photo & Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-100">
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Live Portrait Preview
                </label>
                <div className="w-40 h-48 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md bg-slate-100 relative group">
                  {headImage ? (
                    <img
                      src={headImage}
                      alt={headNameEnglish || 'Principal'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-3">
                      <User size={40} className="mb-2 opacity-50" />
                      No Photo Set
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">
                  Professional square or 3:4 portrait photo recommended
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <ImageUploader
                  label="Principal Photo (Upload file or paste image URL)"
                  value={headImage}
                  onChange={(val) => setHeadImage(val)}
                />
              </div>
            </div>

            {/* Name & Designation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Principal Name (मराठी)
                </label>
                <input
                  type="text"
                  value={headNameMarathi}
                  onChange={(e) => setHeadNameMarathi(e.target.value)}
                  placeholder="उदा. डॉ. पी. एम. काटकर"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Principal Name (English)
                </label>
                <input
                  type="text"
                  value={headNameEnglish}
                  onChange={(e) => setHeadNameEnglish(e.target.value)}
                  placeholder="e.g. Dr. P. M. Katkar"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Designation / पद (e.g. प्राचार्य / Principal)
                </label>
                <input
                  type="text"
                  value={headTitle}
                  onChange={(e) => setHeadTitle(e.target.value)}
                  placeholder="उदा. प्राचार्य / Principal"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Academic Qualifications (शैक्षणिक पात्रता)
                </label>
                <input
                  type="text"
                  value={headQualifications}
                  onChange={(e) => setHeadQualifications(e.target.value)}
                  placeholder="e.g. M.Sc., Ph.D., NET/SET"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Principal Office Contact Phone
                </label>
                <input
                  type="text"
                  value={headPhone}
                  onChange={(e) => setHeadPhone(e.target.value)}
                  placeholder="e.g. 07172-255778 / 9422906289"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Principal Official Email
                </label>
                <input
                  type="email"
                  value={headEmail}
                  onChange={(e) => setHeadEmail(e.target.value)}
                  placeholder="e.g. principal@spm.ac.in"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Principal Quote */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Leadership Vision Quote / बोधवाक्य (Highlighted in page spotlight)
              </label>
              <input
                type="text"
                value={headQuote}
                onChange={(e) => setHeadQuote(e.target.value)}
                placeholder="e.g. Empowering students with academic rigor, ethical values, and holistic development."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
              />
            </div>

            {/* Principal Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Principal's Message to Students & Parents (प्राचार्यांचे मनोगत व संदेश)
              </label>
              <textarea
                rows={4}
                value={headMessage}
                onChange={(e) => setHeadMessage(e.target.value)}
                placeholder="Enter detailed message from the Principal..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: OFFICIAL WEBSITE OF THE INSTITUTION (अधिकृत संकेतस्थळ)
           ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-5 px-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Globe size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-slate-800">
                  Official Website of that Institute (अधिकृत संकेतस्थळ)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Displayed with a prominent button on the institution page and hero banner
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Institution Website URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  placeholder="https://spm.ac.in"
                  className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
                {websiteLink && (
                  <a
                    href={websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shrink-0"
                  >
                    <ExternalLink size={14} /> Test Link
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Include complete protocol (e.g. <code>https://spm.ac.in</code>)
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: INSTITUTION PROFILE, BANNER & CAMPUS INFORMATION
           ========================================================================= */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 p-5 px-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Building size={20} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-slate-800">
                  Institution Identity, Campus Media & Overview
                </h2>
                <p className="text-[11px] text-slate-500">
                  Establishment, affiliations, campus photo, and description
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Institution Name (मराठी)
                </label>
                <input
                  type="text"
                  value={nameMarathi}
                  onChange={(e) => setNameMarathi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Institution Name (English)
                </label>
                <input
                  type="text"
                  value={nameEnglish}
                  onChange={(e) => setNameEnglish(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Category / Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                >
                  <option value="College">Degree College / वरिष्ठ महाविद्यालय</option>
                  <option value="Junior College">Junior College / कनिष्ठ महाविद्यालय</option>
                  <option value="School">School / उच्च प्राथमिक व माध्यमिक शाळा</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Established Year (स्थापना वर्ष)
                </label>
                <input
                  type="text"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  placeholder="e.g. 1970"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Affiliation & Accreditations (संलग्नता व मान्यता)
                </label>
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g. Affiliated to Gondwana University, Gadchiroli • NAAC 'A' Grade (CGPA 3.12)"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Campus Address (पत्ता)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Ganj Ward, Chandrapur - 442402 (Maharashtra)"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Campus Banner Image */}
            <ImageUploader
              label="Campus Banner Image (Used as hero banner on institution page)"
              value={bannerImage}
              onChange={(val) => setBannerImage(val)}
            />

            {/* About Institution Overview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Comprehensive Description / About Overview (परिचय व इतिहास)
              </label>
              <textarea
                rows={5}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                placeholder="Enter comprehensive information about the institution's history, courses, facilities, and achievements..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 focus:bg-white outline-none font-medium text-slate-800 text-sm leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <Link
            to="/admin/institutions"
            className="px-5 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-wider"
          >
            ← Back to Institutions
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-950/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

// InstitutionsManager
function InstitutionsManager() {
  const { confirm } = useConfirm();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'colleges' | 'schools'>('all');

  const [customInstitutions, setCustomInstitutions] = useState<any[]>([]);

  useEffect(() => {
    fetchContentBlocks()
      .then((data) => {
        setContent(data || {});
        // Find custom dynamic institutions we added
        try {
          if (data && data['Custom_Institutions_List']) {
            setCustomInstitutions(JSON.parse(data['Custom_Institutions_List']));
          }
        } catch (e) {
          console.error("Failed to parse custom institutions", e);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const addNewInstitution = async () => {
    const nextId = MANDAL_INSTITUTIONS.length + customInstitutions.length + 1;
    const newInst = {
      id: nextId,
      nameMarathi: "नवीन संस्था",
      nameEnglish: "New Institution",
      category: "School & Junior College",
      isCustom: true
    };
    
    const updated = [...customInstitutions, newInst];
    setCustomInstitutions(updated);
    
    // Save structural reference to database
    try {
      await saveContentBlock('Custom_Institutions_List', JSON.stringify(updated));
      alert("New institution added! You can now edit its details.");
    } catch (e) {
      alert("Failed to create institution in database");
    }
  };

  const deleteCustomInstitution = async (id: number) => {
    const confirmed = await confirm({ title: 'Delete Institution', message: 'Are you sure you want to delete this institution? This action cannot be undone.' });
    if (!confirmed) return;
    
    const updated = customInstitutions.filter(inst => inst.id !== id);
    setCustomInstitutions(updated);
    
    try {
      await saveContentBlock('Custom_Institutions_List', JSON.stringify(updated));
    } catch (e) {
      alert("Failed to update database");
    }
  };

  const baseAndCustomInstitutions = [...MANDAL_INSTITUTIONS, ...customInstitutions];

  const institutionsList = baseAndCustomInstitutions.map((inst) => {
    const id = inst.id;
    const nameMarathi = content[`Inst_${id}_NameMarathi`] || inst.nameMarathi;
    const nameEnglish = content[`Inst_${id}_NameEnglish`] || inst.nameEnglish;
    const link = content[`Inst_${id}_WebsiteLink`] || inst.link;
    const headName = content[`Inst_${id}_HeadNameMarathi`] || inst.headNameMarathi;
    const headDesignation = content[`Inst_${id}_HeadTitle`] || inst.headDesignationMarathi;
    const headPhoto = content[`Inst_${id}_HeadImage`] || inst.headPhoto;
    const banner = content[`Inst_${id}_BannerImage`] || inst.imageUrl;
    const category = content[`Inst_${id}_Category`] || inst.category;

    return {
      ...inst,
      nameMarathi,
      nameEnglish,
      link,
      headName,
      headDesignation,
      headPhoto,
      banner,
      category,
    };
  });

  const filteredInstitutions = institutionsList.filter((inst) => {
    const matchesSearch =
      inst.nameMarathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(inst.id).includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedCategory === 'colleges') {
      return inst.category === 'College' || inst.id <= 4;
    }
    if (selectedCategory === 'schools') {
      return inst.category !== 'College' && inst.id > 4;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 font-medium">
        Loading institutions directory...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-1">Institutions Directory</h1>
          <p className="text-slate-500 text-sm">
            Manage all colleges, junior colleges, schools, Principal profiles, and official website links.
          </p>
        </div>
        <button 
          onClick={addNewInstitution}
          className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md shrink-0"
        >
          <Plus size={16} /> Add New Institution
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-950 text-amber-400'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Institutions ({institutionsList.length})
          </button>
          <button
            onClick={() => setSelectedCategory('colleges')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'colleges'
                ? 'bg-emerald-950 text-amber-400'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Degree Colleges
          </button>
          <button
            onClick={() => setSelectedCategory('schools')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'schools'
                ? 'bg-emerald-950 text-amber-400'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Schools & Jr Colleges
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by college or principal name..."
            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Institutions Table & Cards */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6">ID & Campus</th>
                <th className="p-4">Institution Name</th>
                <th className="p-4">Principal / Head of Inst.</th>
                <th className="p-4">Official Website</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-5">
                        #{inst.id}
                      </span>
                      <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        {inst.banner ? (
                          <img
                            src={inst.banner}
                            alt={inst.nameEnglish}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Building size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 max-w-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm inline-block mb-1">
                      {inst.category || (inst.id <= 4 ? 'College' : 'School')}
                    </span>
                    <p className="font-serif font-bold text-slate-800 text-sm leading-snug">
                      {inst.nameMarathi}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {inst.nameEnglish}
                    </p>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/80 bg-slate-100 shrink-0">
                        {inst.headPhoto ? (
                          <img
                            src={inst.headPhoto}
                            alt={inst.headName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs">
                          {inst.headName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {inst.headDesignation}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 max-w-[200px]">
                    {inst.link && inst.link !== '#' ? (
                      <a
                        href={inst.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-amber-600 truncate max-w-[180px]"
                        title={inst.link}
                      >
                        <Globe size={13} className="shrink-0 text-amber-600" />
                        <span className="truncate">{inst.link.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No website link</span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inst.isCustom && (
                        <button
                          onClick={() => deleteCustomInstitution(inst.id)}
                          className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Custom Institution"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <a
                        href={`/institution/${inst.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Live Page"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <Link
                        to={`/admin/institution-content/${inst.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        <Edit size={13} /> Edit Profile
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Image Upload Component
function ImageUploader({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void, key?: React.Key }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Compress image to ensure it doesn't hit server payload limits
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      const MAX_SIZE = 1200;
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onChange(dataUrl);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">{label}</label>
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 shrink-0 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center relative group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <ImageIcon className="text-slate-300" size={32} />
          )}
          <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <UploadCloud className="text-white" size={24} />
          </div>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-2">Upload a high-quality image from your computer. (Max size ~2MB recommended for performance)</p>
          <p className="text-xs text-slate-400 font-mono break-all max-w-sm overflow-hidden h-10">
            {value ? value.substring(0, 50) + '...' : 'No image selected'}
          </p>
          <button 
            type="button"
            onClick={() => onChange('')} 
            className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
          >
            Remove Image
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper to get corresponding live site route for quick preview
function getLiveSectionLink(sectionTitle: string): { url: string; label: string } {
  const t = sectionTitle.toLowerCase();
  if (t.includes('contact')) return { url: '/contact', label: 'संपर्क पृष्ठ (Contact Page)' };
  if (t.includes('about')) return { url: '/about', label: 'आमच्याबद्दल पृष्ठ (About Us)' };
  if (t.includes('admissions')) return { url: '/admissions', label: 'प्रवेश पृष्ठ (Admissions)' };
  if (t.includes('staff') || t.includes('adminstaff')) return { url: '/adminstaff', label: 'प्रशासकीय कर्मचारी पृष्ठ (Admin Staff)' };
  if (t.includes('president') || t.includes('secretary') || t.includes('vice') || t.includes('treasurer')) return { url: '/#leadership', label: 'नेतृत्व विभाग (Leadership Section)' };
  if (t.includes('stats')) return { url: '/#stats', label: 'सांख्यिकी विभाग (Stats Section)' };
  if (t.includes('testimonials')) return { url: '/#testimonials', label: 'अभिप्राय विभाग (Testimonials)' };
  return { url: '/', label: 'मुख्यपृष्ठ (Home Page)' };
}

// ContentBlocksManager with complete human-readable labels, descriptions, and pre-filled live defaults
export function ContentBlocksManager({ sectionTitle = "Content Blocks", filterKeys }: { sectionTitle?: string, filterKeys?: string[] }) {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'mr' | 'en'>('all');
  const [restoredKeys, setRestoredKeys] = useState<Record<string, boolean>>({});

  // Generic List State for /content
  const [isEditingGeneric, setIsEditingGeneric] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [genericTitle, setGenericTitle] = useState('');
  const [genericContent, setGenericContent] = useState('');

  useEffect(() => {
    fetchContentBlocks().then(data => { 
      const merged: Record<string, string> = { ...(data || {}) };
      if (filterKeys) {
        for (const key of filterKeys) {
          // If empty, missing, or undefined, populate with actual live default so admin sees what is on the site
          if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
            merged[key] = getDefaultContent(key);
          }
        }
      }
      setBlocks(merged);
      setLoading(false); 
    }).catch(err => {
      console.error('Failed to load content blocks:', err);
      // Populate defaults so the admin panel remains completely usable and visible
      if (filterKeys) {
        const fallback: Record<string, string> = {};
        for (const key of filterKeys) {
          fallback[key] = getDefaultContent(key);
        }
        setBlocks(fallback);
      }
      setLoading(false);
    });
  }, [filterKeys]);

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      if (filterKeys) {
        // Save each block (use current value or fallback default)
        await Promise.all(
          filterKeys.map(key => {
            const val = blocks[key] !== undefined ? blocks[key] : getDefaultContent(key);
            return saveContentBlock(key, val);
          })
        );
      }
      setSuccessMsg('सर्व बदल यशस्वीरित्या जतन व प्रकाशित झाले! (All changes saved & published)');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) { 
      console.error(error); 
      alert(error?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, val: string) => {
    setBlocks(prev => ({ ...prev, [key]: val }));
  };

  const handleResetField = (key: string) => {
    const defaultVal = getDefaultContent(key);
    setBlocks(prev => ({ ...prev, [key]: defaultVal }));
    setRestoredKeys(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setRestoredKeys(prev => ({ ...prev, [key]: false }));
    }, 2500);
  };

  const renderField = (key: string) => {
    const meta = CONTENT_METADATA[key] || {
      key,
      label: key.replace(/_/g, ' '),
      labelMarathi: key.replace(/_/g, ' '),
      description: 'संकेतस्थळावरील मजकूर किंवा माहिती विभाग.',
      defaultValue: getDefaultContent(key),
      language: key.endsWith('_Mr') ? 'mr' : key.endsWith('_En') ? 'en' : 'system',
      group: 'General Settings',
      type: (key.includes('Logo') || key.includes('Image') || key.includes('Icon') || key.includes('Photo') || key.includes('Banner')) ? 'image' : (key.includes('URL') || key.includes('Link')) ? 'link' : ['Name', 'Phone', 'Email', 'Value', 'Label', 'Title', 'Subtitle', 'Est', 'Location'].some(str => key.includes(str)) ? 'input' : 'textarea'
    };

    const val = blocks[key] !== undefined ? blocks[key] : meta.defaultValue;
    const isDefault = val === meta.defaultValue;
    const isRestored = restoredKeys[key];

    // Language badge styling
    const langBadge = meta.language === 'mr' ? (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-900 border-amber-300 font-serif flex items-center gap-1">
        <span>🇮🇳</span> मराठी (Marathi)
      </span>
    ) : meta.language === 'en' ? (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-indigo-50 text-indigo-900 border-indigo-200 flex items-center gap-1">
        <span>🇬🇧</span> English (इंग्रजी)
      </span>
    ) : (
      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1">
        <span>⚙️</span> Global / Setting
      </span>
    );

    // Render Image Uploader
    if (meta.type === 'image' || key.includes('Logo') || key.includes('Image') || key.includes('Icon')) {
      return (
        <div key={key} className="bg-white border border-slate-200/90 rounded-2xl p-6 mb-6 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {langBadge}
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ID: {key}
                </span>
                {!isDefault && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    सुधारित (Modified)
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {meta.labelMarathi ? `${meta.labelMarathi}` : meta.label}
                {meta.labelMarathi && meta.label !== meta.labelMarathi && (
                  <span className="text-sm font-normal text-slate-500 ml-2">({meta.label})</span>
                )}
              </h4>
            </div>

            {!isDefault && (
              <button
                type="button"
                onClick={() => handleResetField(key)}
                className="text-xs text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1.5 font-semibold"
                title="मूळ फोटो पुन्हा सेट करा (Restore Default Photo)"
              >
                <RotateCcw size={13} className={isRestored ? "animate-spin" : ""} />
                <span>{isRestored ? 'पुनर्संचयित झाले!' : 'मूळ फोटो भरा (Reset Default Photo)'}</span>
              </button>
            )}
          </div>

          <div className="text-xs text-slate-600 mb-4 bg-emerald-50/50 p-3 rounded-xl border border-emerald-150 flex items-start gap-2">
            <Info size={15} className="text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-emerald-950 font-semibold">कुठे दिसते (Where it appears):</strong> {meta.description}
            </span>
          </div>

          <ImageUploader 
            label={meta.labelMarathi || meta.label} 
            value={val} 
            onChange={(newVal) => handleFieldChange(key, newVal)} 
          />

          <div className="mt-3">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
              किंवा थेट फोटो URL / पाथ टाका (Direct Image URL or Path):
            </label>
            <input
              type="text"
              value={val}
              onChange={e => handleFieldChange(key, e.target.value)}
              placeholder="https://... किंवा /images/..."
              className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all"
            />
          </div>
        </div>
      );
    }

    const isSmall = meta.type === 'input' || meta.type === 'link';

    return (
      <div key={key} className="bg-white border border-slate-200/90 rounded-2xl p-6 mb-6 shadow-xs hover:border-emerald-400/80 transition-all">
        {/* Header with Title & Metadata */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {langBadge}
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                ID: {key}
              </span>
              {!isDefault && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  सुधारित (Modified)
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {meta.labelMarathi && (
                <span className="text-slate-900 font-serif text-lg">{meta.labelMarathi}</span>
              )}
              {meta.label && meta.label !== meta.labelMarathi && (
                <span className="text-slate-500 font-sans font-medium text-sm ml-2">
                  ({meta.label})
                </span>
              )}
            </h4>
          </div>

          <div>
            {!isDefault && (
              <button
                type="button"
                onClick={() => handleResetField(key)}
                className="text-xs text-slate-700 hover:text-emerald-950 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-1.5 font-semibold"
                title="मूळ मजकूर पुन्हा भरा (Restore Original Live Text)"
              >
                <RotateCcw size={13} className={isRestored ? "animate-spin" : ""} />
                <span>{isRestored ? 'पुनर्संचयित झाले!' : 'मूळ मजकूर भरा (Reset Default)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Description / Where it appears */}
        <div className="text-xs text-slate-600 mb-3.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
          <Info size={15} className="text-emerald-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-slate-800 font-semibold">कुठे दिसते (Where it appears):</strong> {meta.description}
          </span>
        </div>

        {/* Input or Textarea */}
        <div>
          {isSmall ? (
            <input 
              type="text" 
              value={val} 
              onChange={e => handleFieldChange(key, e.target.value)} 
              placeholder={meta.placeholder || `${meta.labelMarathi || meta.label} प्रविष्ट करा...`}
              className={`w-full bg-slate-50/70 border border-slate-300 p-3.5 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-none transition-all font-medium text-slate-900 ${
                meta.language === 'mr' ? 'text-base font-normal leading-relaxed' : 'text-sm'
              }`}
            />
          ) : (
            <textarea 
              value={val} 
              onChange={e => handleFieldChange(key, e.target.value)} 
              rows={meta.rows || 4}
              placeholder={meta.placeholder || `${meta.labelMarathi || meta.label} प्रविष्ट करा...`}
              className={`w-full bg-slate-50/70 border border-slate-300 p-3.5 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-none transition-all font-medium text-slate-900 leading-relaxed ${
                meta.language === 'mr' ? 'text-base font-normal' : 'text-sm'
              }`}
            ></textarea>
          )}
        </div>

        {/* Live Metrics */}
        <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px] text-slate-400">
          <span className="font-mono">
            {val.length} अक्षरे (characters) • {val.trim() ? val.trim().split(/\s+/).length : 0} शब्द (words)
          </span>
          {meta.defaultValue && isDefault && (
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> थेट सक्रिय मूळ मजकूर (Original live text is active)
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
    </div>
  );

  // Layout for Specific Menu Items
  if (filterKeys) {
    const liveLink = getLiveSectionLink(sectionTitle);

    // Apply search filter and language filter
    const filteredKeys = filterKeys.filter(key => {
      const meta = CONTENT_METADATA[key];
      const val = blocks[key] || meta?.defaultValue || '';
      
      // Language filter
      if (languageFilter === 'mr' && meta?.language !== 'mr') return false;
      if (languageFilter === 'en' && meta?.language !== 'en') return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const label = (meta?.label || '').toLowerCase();
      const labelMr = (meta?.labelMarathi || '').toLowerCase();
      const desc = (meta?.description || '').toLowerCase();
      const k = key.toLowerCase();
      const v = val.toLowerCase();
      return label.includes(q) || labelMr.includes(q) || desc.includes(q) || k.includes(q) || v.includes(q);
    });

    // Group filtered keys by logical section
    const groupedKeys: Record<string, string[]> = {};
    for (const key of filteredKeys) {
      const groupName = CONTENT_METADATA[key]?.group || 'General Content (सामान्य माहिती)';
      if (!groupedKeys[groupName]) groupedKeys[groupName] = [];
      groupedKeys[groupName].push(key);
    }

    const totalModifiedCount = filterKeys.filter(k => {
      const current = blocks[k] !== undefined ? blocks[k] : getDefaultContent(k);
      return current !== getDefaultContent(k);
    }).length;

    return (
      <div className="max-w-5xl">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-700" />
                  वेबसाइट मजकूर व्यवस्थापक (Website Content Editor)
                </span>
                {totalModifiedCount > 0 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                    {totalModifiedCount} बदल केलेले फील्ड्स
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1.5">
                {sectionTitle}
              </h1>
              <p className="text-slate-600 text-sm">
                खालील मजकुरामध्ये बदल करा. प्रत्येक बॉक्समध्ये सध्या वेबसाइटवर दिसणारा मजकूर व तो कुठे दिसतो हे स्पष्ट नमूद आहे.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={liveLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center gap-2 border border-slate-200 shadow-2xs"
                title="थेट वेबसाइटवर हा विभाग पहा (View live page in new tab)"
              >
                <ExternalLink size={14} />
                <span>{liveLink.label}</span>
              </a>

              <button 
                type="button" 
                onClick={() => handleSaveAll()} 
                disabled={saving}
                className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/20 disabled:opacity-70 text-sm cursor-pointer"
              >
                {saving ? 'जतन करत आहे...' : 'बदल जतन करा (Publish Changes)'}
                {!saving && <UploadCloud size={16} />}
              </button>
            </div>
          </div>

          {successMsg && (
            <div className="mt-5 bg-emerald-50 text-emerald-900 px-5 py-3 rounded-xl font-bold flex items-center gap-2.5 border border-emerald-200 shadow-xs animate-fadeIn">
              <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Filter & Search Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="फील्ड किंवा शब्द शोधा (Search fields)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Language filter tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setLanguageFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  languageFilter === 'all' 
                    ? 'bg-white text-emerald-950 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                सर्व फील्ड्स ({filterKeys.length})
              </button>
              <button
                type="button"
                onClick={() => setLanguageFilter('mr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  languageFilter === 'mr' 
                    ? 'bg-amber-400 text-emerald-950 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇮🇳</span> मराठी
              </button>
              <button
                type="button"
                onClick={() => setLanguageFilter('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  languageFilter === 'en' 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🇬🇧</span> English
              </button>
            </div>
          </div>
        </div>

        {/* Grouped Fields */}
        <form onSubmit={handleSaveAll}>
          {Object.keys(groupedKeys).length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <HelpCircle size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-base font-medium">कोणतेही फील्ड सापडले नाही (No fields matched your search filter).</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setLanguageFilter('all'); }}
                className="mt-3 text-xs font-bold text-emerald-800 hover:underline"
              >
                शोध रीसेट करा (Clear search filter)
              </button>
            </div>
          ) : (
            Object.entries(groupedKeys).map(([groupName, keysInGroup]) => (
              <div key={groupName} className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-6 mb-8 shadow-xs">
                {/* Group Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs">
                      <Layers size={17} />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900">{groupName}</h3>
                      <span className="text-xs text-slate-500 font-medium">
                        या विभागातील {keysInGroup.length} फील्ड्स ({keysInGroup.length} editable fields)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fields List */}
                <div>
                  {keysInGroup.map(key => renderField(key))}
                </div>
              </div>
            ))
          )}
          
          {/* Bottom Floating/Sticky Save Bar */}
          <div className="sticky bottom-4 bg-emerald-950/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl z-20">
            <div>
              <h4 className="text-base font-bold text-amber-300">बदल जतन करण्यासाठी तयार आहात का?</h4>
              <p className="text-xs text-emerald-200">
                &apos;बदल प्रकाशित करा&apos; वर क्लिक करताच हे बदल त्वरित थेट संकेतस्थळावर (Live Website) दिसतील.
              </p>
            </div>
            
            <button 
              type="submit" 
              disabled={saving}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 text-sm shrink-0 cursor-pointer"
            >
              {saving ? 'जतन करत आहे...' : 'बदल प्रकाशित करा (Save & Publish All)'}
              {!saving && <UploadCloud size={16} />}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Layout for "All Raw Blocks" (Generic Table with Metadata Descriptions)
  const allKeys = Object.keys(blocks);
  const filteredAllKeys = allKeys.filter(k => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const meta = CONTENT_METADATA[k];
    const val = (blocks[k] || '').toLowerCase();
    return k.toLowerCase().includes(q) || val.includes(q) || (meta?.label || '').toLowerCase().includes(q) || (meta?.labelMarathi || '').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">Raw Content Blocks</h1>
          <p className="text-slate-500">Advanced Database View: Edit raw text strings directly in the database.</p>
        </div>
        {!isEditingGeneric && (
          <button 
            type="button"
            onClick={() => { setIsEditingGeneric(true); setGenericTitle(''); setGenericContent(''); setCurrentId(null); }} 
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md text-sm"
          >
            <Plus size={16} /> Add New Block
          </button>
        )}
      </div>

      {/* Quick Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search raw blocks by key, content, or label..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 outline-none"
          />
        </div>
      </div>

      {isEditingGeneric ? (
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 mb-8 max-w-3xl">
          <form onSubmit={async (e) => {
            e.preventDefault();
            await saveContentBlock(genericTitle, genericContent);
            const data = await fetchContentBlocks();
            setBlocks(data);
            setIsEditingGeneric(false);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Key / ID</label>
              <input 
                type="text" 
                required 
                value={genericTitle} 
                onChange={e => setGenericTitle(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 outline-none font-medium font-mono text-sm" 
                disabled={!!currentId} 
              />
              {CONTENT_METADATA[genericTitle] && (
                <p className="text-xs text-emerald-800 mt-1 font-medium">
                  {CONTENT_METADATA[genericTitle].labelMarathi} ({CONTENT_METADATA[genericTitle].label}) — {CONTENT_METADATA[genericTitle].description}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Content / मजकूर</label>
              <textarea 
                required 
                value={genericContent} 
                onChange={e => setGenericContent(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:border-emerald-500 outline-none font-medium text-sm" 
                rows={6}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setIsEditingGeneric(false)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md text-sm">Save to Database</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-emerald-950 text-emerald-50 text-xs uppercase tracking-wider font-bold">
                <th className="p-4">Key & Label</th>
                <th className="p-4">Location / Description</th>
                <th className="p-4">Current Value</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllKeys.map((key) => {
                const meta = CONTENT_METADATA[key];
                return (
                  <tr key={key} className="border-b border-slate-100 hover:bg-emerald-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs text-emerald-950 font-bold mb-1">{key}</div>
                      {meta && (
                        <div className="text-xs text-slate-700 font-semibold">
                          {meta.labelMarathi} <span className="text-slate-400 font-normal">({meta.label})</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-600 max-w-xs">
                      {meta?.description || 'General text block'}
                    </td>
                    <td className="p-4 text-xs text-slate-800 truncate max-w-sm font-medium">
                      {blocks[key] || <span className="text-slate-400 italic">Empty</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        type="button"
                        onClick={() => { setGenericTitle(key); setGenericContent(blocks[key] || ''); setCurrentId(key); setIsEditingGeneric(true); }} 
                        className="text-emerald-700 hover:text-emerald-900 p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Edit size={14} /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Dedicated Board of Directors (कार्यकारिणी) Photo & Profile Manager
function BoardOfDirectorsAdmin() {
  const [blocks, setBlocks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | string | null>(null);
  const [savingAll, setSavingAll] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchContentBlocks()
      .then((data) => {
        setBlocks(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleFieldChange = (key: string, val: string) => {
    setBlocks((prev) => ({ ...prev, [key]: val }));
  };

  const saveBanner = async () => {
    setSavingId('banner');
    try {
      const bannerVal = blocks['BoardOfDirectors_Banner'] || blocks['Management_Banner_Image'] || '';
      await Promise.all([
        saveContentBlock('BoardOfDirectors_Banner', bannerVal),
        saveContentBlock('Management_Banner_Image', bannerVal)
      ]);
      setSuccessMsg('Board of Directors banner photo updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to save banner');
    } finally {
      setSavingId(null);
    }
  };

  const saveDirector = async (srNo: number) => {
    setSavingId(srNo);
    try {
      const imgKey = `Leader${srNo}_Image`;
      const imgVal = blocks[imgKey] || '';
      
      const promises = [saveContentBlock(imgKey, imgVal)];

      // Keep role message pages synchronized
      if (srNo === 1) promises.push(saveContentBlock('President_Image', imgVal));
      if (srNo === 2) promises.push(saveContentBlock('WorkingPresident_Image', imgVal));
      if (srNo === 3) promises.push(saveContentBlock('VicePresident1_Image', imgVal));
      if (srNo === 4) promises.push(saveContentBlock('VicePresident2_Image', imgVal));
      if (srNo === 5) promises.push(saveContentBlock('Secretary_Image', imgVal));

      await Promise.all(promises);

      setSuccessMsg(`Photo for Director #${srNo} updated!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to save director photo');
    } finally {
      setSavingId(null);
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    try {
      const bannerVal = blocks['BoardOfDirectors_Banner'] || blocks['Management_Banner_Image'] || '';
      const promises = [];
      if (bannerVal) {
        promises.push(saveContentBlock('BoardOfDirectors_Banner', bannerVal));
        promises.push(saveContentBlock('Management_Banner_Image', bannerVal));
      }

      for (const member of EXECUTIVE_COMMITTEE) {
        const imgKey = `Leader${member.srNo}_Image`;
        const imgVal = blocks[imgKey];
        if (imgVal !== undefined) {
          promises.push(saveContentBlock(imgKey, imgVal));
          if (member.srNo === 1) promises.push(saveContentBlock('President_Image', imgVal));
          if (member.srNo === 2) promises.push(saveContentBlock('WorkingPresident_Image', imgVal));
          if (member.srNo === 3) promises.push(saveContentBlock('VicePresident1_Image', imgVal));
          if (member.srNo === 4) promises.push(saveContentBlock('VicePresident2_Image', imgVal));
          if (member.srNo === 5) promises.push(saveContentBlock('Secretary_Image', imgVal));
        }
      }
      await Promise.all(promises);
      setSuccessMsg('All Board of Directors photos saved & published successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to publish changes');
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
      </div>
    );
  }

  const bannerVal = blocks['BoardOfDirectors_Banner'] || blocks['Management_Banner_Image'] || '';

  return (
    <div className="max-w-5xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Users size={14} /> Sub Menu: Board of Directors
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-800">
            Board of Directors Photos (कार्यकारिणी मंडळ)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Update director portraits and the header banner photo shown on the website's "Board of Directors" sub-menu page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
          <button
            type="button"
            onClick={saveAll}
            disabled={savingAll}
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all disabled:opacity-50 text-sm"
          >
            {savingAll ? (
              <>Saving All...</>
            ) : (
              <>
                <Save size={16} /> Publish All Photos
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Sub-menu Header Banner Photo */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon size={16} className="text-amber-600" />
              Board of Directors Page Banner Photo (Optional)
            </h2>
            <p className="text-xs text-slate-500">
              Large scenic or group photo banner displayed at the top of the Board of Directors page.
            </p>
          </div>
          <button
            type="button"
            onClick={saveBanner}
            disabled={savingId === 'banner'}
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save size={14} />
            {savingId === 'banner' ? 'Saving...' : 'Save Banner'}
          </button>
        </div>

        <ImageUploader
          label="Upload Banner Photo"
          value={bannerVal}
          onChange={(newVal) => {
            handleFieldChange('BoardOfDirectors_Banner', newVal);
            handleFieldChange('Management_Banner_Image', newVal);
          }}
        />

        <div className="mt-3">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Or Paste Direct Banner Image URL:
          </label>
          <input
            type="text"
            value={bannerVal}
            onChange={(e) => {
              handleFieldChange('BoardOfDirectors_Banner', e.target.value);
              handleFieldChange('Management_Banner_Image', e.target.value);
            }}
            placeholder="https://example.com/images/mandal-board-banner.jpg"
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* 2. All 11 Executive Committee Director Portraits */}
      <div className="mb-6">
        <h2 className="text-lg font-serif font-bold text-slate-800 mb-1">
          Individual Director Portraits (11 पदाधिकाऱ्यांचे फोटो)
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Upload or update the photo for each individual Board of Director below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXECUTIVE_COMMITTEE.map((member) => {
            const imgKey = `Leader${member.srNo}_Image`;
            const currentImg =
              blocks[imgKey] !== undefined
                ? blocks[imgKey]
                : member.srNo === 1 && blocks['President_Image']
                ? blocks['President_Image']
                : member.srNo === 2 && blocks['WorkingPresident_Image']
                ? blocks['WorkingPresident_Image']
                : member.srNo === 3 && blocks['VicePresident1_Image']
                ? blocks['VicePresident1_Image']
                : member.srNo === 4 && blocks['VicePresident2_Image']
                ? blocks['VicePresident2_Image']
                : member.srNo === 5 && blocks['Secretary_Image']
                ? blocks['Secretary_Image']
                : member.imageUrl || '';

            return (
              <div
                key={member.srNo}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Sr & Designation */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-7 h-7 rounded-full bg-emerald-950 text-amber-400 font-bold text-xs flex items-center justify-center">
                      #{member.srNo}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {member.designationMarathi} ({member.designationEnglish})
                    </span>
                  </div>

                  {/* Director Identity Info */}
                  <div className="mb-4">
                    <h3 className="text-base font-serif font-bold text-emerald-950">
                      {member.nameMarathi}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {member.nameEnglish}
                    </p>
                  </div>

                  {/* Image Upload Component */}
                  <ImageUploader
                    label={`Director #${member.srNo} Photo`}
                    value={currentImg}
                    onChange={(newVal) => handleFieldChange(imgKey, newVal)}
                  />

                  {/* Direct Photo URL Input */}
                  <div className="mt-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Or Direct Image URL:
                    </label>
                    <input
                      type="text"
                      value={currentImg}
                      onChange={(e) => handleFieldChange(imgKey, e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Save Director Button */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Key: {imgKey}
                  </span>
                  <button
                    type="button"
                    onClick={() => saveDirector(member.srNo)}
                    disabled={savingId === member.srNo}
                    className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Save size={13} />
                    {savingId === member.srNo ? 'Saving...' : 'Save Photo'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Save All Bar */}
      <div className="bg-emerald-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-amber-300">Ready to publish all photos?</h3>
          <p className="text-xs text-emerald-200">
            This saves all 11 director portraits and the banner photo to the live database immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          disabled={savingAll}
          className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-8 py-3 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2 shrink-0"
        >
          {savingAll ? 'Publishing...' : 'Save & Publish All Photos'}
          {!savingAll && <UploadCloud size={16} />}
        </button>
      </div>
    </div>
  );
}




export default function Admin() {
  return (
    <ConfirmProvider>
      <AdminInner />
    </ConfirmProvider>
  );
}
