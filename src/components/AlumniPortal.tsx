import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, GraduationCap, Briefcase, User, MapPin, Building2, Calendar, Mail, Phone, Linkedin, Send, Upload, Image as ImageIcon, Printer, X, Users, Search } from 'lucide-react';

interface AlumniPortalProps {
  onClose?: () => void;
  isMarathi?: boolean;
}

export function AlumniPortal({ onClose, isMarathi = false }: AlumniPortalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    institution: '',
    passingYear: '',
    degree: '',
    profession: '',
    company: '',
    designation: '',
    location: '',
    linkedin: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [viewMode, setViewMode] = useState<'register' | 'directory'>('directory');
  const [directoryData, setDirectoryData] = useState<any[]>([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (viewMode === 'directory' && directoryData.length === 0) {
      fetchDirectory();
    }
  }, [viewMode]);

  const fetchDirectory = async () => {
    setLoadingDirectory(true);
    try {
      const res = await fetch('/api/alumni/public');
      if (res.ok) {
        const data = await res.json();
        setDirectoryData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDirectory(false);
    }
  };
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo size should be less than 5MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    
    try {
      let photoUrl = '';
      if (photo) {
        const formDataUpload = new FormData();
        formDataUpload.append('photo', photo);
        const uploadRes = await fetch('/api/alumni/upload-photo', {
          method: 'POST',
          body: formDataUpload
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload photo');
        photoUrl = uploadData.url;
        setUploadedPhotoUrl(photoUrl);
      }

      const submissionData = { ...formData, photoUrl };

      const res = await fetch('/api/alumni/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      
      setSuccess(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCertificate = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Alumni Certificate - ${formData.fullName}</title>
        <style>
          @page { size: A4 landscape; margin: 0; }
          body { 
            font-family: "Times New Roman", Times, serif; 
            margin: 0; 
            padding: 0; 
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #fff;
            -webkit-print-color-adjust: exact;
          }
          .certificate-container {
            width: 260mm;
            height: 180mm;
            border: 15px solid #064e3b;
            padding: 10mm;
            box-sizing: border-box;
            position: relative;
            background-color: #fdfbf7;
            background-image: radial-gradient(#064e3b 1px, transparent 1px);
            background-size: 20px 20px;
            background-position: 0 0;
          }
          .inner-border {
            border: 2px solid #b45309;
            height: 100%;
            padding: 20px;
            text-align: center;
            box-sizing: border-box;
            position: relative;
            background-color: rgba(255, 255, 255, 0.95);
          }
          .header {
            color: #064e3b;
            font-size: 28px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
            margin-bottom: 5px;
            letter-spacing: 2px;
          }
          .sub-header {
            color: #b45309;
            font-size: 22px;
            margin-bottom: 25px;
            font-style: italic;
          }
          .content-area {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            padding: 0 30px;
          }
          .photo-box {
            width: 120px;
            height: 150px;
            border: 3px solid #064e3b;
            background-color: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .text-content {
            flex: 1;
            padding: 0 40px;
            font-size: 18px;
            line-height: 1.8;
            color: #1e293b;
            text-align: left;
          }
          .highlight {
            font-size: 22px;
            font-weight: bold;
            color: #064e3b;
            border-bottom: 1px dotted #064e3b;
            padding-bottom: 2px;
          }
          .footer-area {
            display: flex;
            justify-content: space-between;
            margin-top: 60px;
            padding: 0 50px;
          }
          .signature-block {
            text-align: center;
            width: 250px;
            position: relative;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-bottom: 5px;
            padding-top: 5px;
            font-size: 16px;
            font-weight: bold;
            color: #064e3b;
          }
          .signature-text {
            font-family: 'Brush Script MT', 'Cedarville Cursive', cursive;
            font-size: 32px;
            color: #000;
            position: absolute;
            bottom: 35px;
            width: 100%;
            left: 0;
          }
          .date-text {
            font-size: 18px;
            position: absolute;
            bottom: 35px;
            width: 100%;
            left: 0;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="inner-border">
            <div class="header">Sarvodaya Shikshan Mandal, Chandrapur</div>
            <div class="sub-header">Alumni Membership Certificate</div>
            
            <div class="content-area">
              <div class="photo-box">
                ${photoPreview ? `<img src="${photoPreview}" alt="Alumni Photo" />` : `<span style="color:#94a3b8;font-size:12px;font-family:sans-serif;">No Photo</span>`}
              </div>
              <div class="text-content">
                This is to proudly certify that <br>
                <span class="highlight">\${formData.fullName}</span> <br>
                is a registered and esteemed alumnus of <br>
                <span class="highlight">\${formData.institution}</span>, <br>
                having successfully completed the degree of <strong>\${formData.degree}</strong> in the year <strong>\${formData.passingYear}</strong>.
              </div>
            </div>

            <div class="footer-area">
              <div class="signature-block">
                <div class="date-text">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div class="signature-line">Date of Registration</div>
              </div>
              <div class="signature-block">
                <div class="signature-text">S. R. Secretary</div>
                <div class="signature-line">Secretary, SSM</div>
              </div>
            </div>
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
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">Registration Successful!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for reconnecting with Sarvodaya Shikshan Mandal. We are proud of our alumni and thrilled to have you back in our network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadCertificate}
              className="px-6 py-3 bg-amber-500 text-emerald-950 font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Printer size={20} />
              Download Certificate
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="px-6 py-3 bg-emerald-900 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      {/* Hero Header */}
      <div className="bg-emerald-950 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-amber-400 text-emerald-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform rotate-3">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
            Alumni Network Portal
          </h1>
          <p className="text-emerald-100/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Reconnect with your alma mater. Join the Sarvodaya Shikshan Mandal global alumni network to stay updated, network with peers, and contribute to the legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setViewMode('register')}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                viewMode === 'register' 
                  ? 'bg-amber-500 text-emerald-950 shadow-lg scale-105' 
                  : 'bg-emerald-900/50 text-white hover:bg-emerald-800 border border-emerald-700'
              }`}
            >
              <User size={20} />
              Register as Alumni
            </button>
            <button
              onClick={() => setViewMode('directory')}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                viewMode === 'directory' 
                  ? 'bg-amber-500 text-emerald-950 shadow-lg scale-105' 
                  : 'bg-emerald-900/50 text-white hover:bg-emerald-800 border border-emerald-700'
              }`}
            >
              <Users size={20} />
              Alumni Directory
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        {viewMode === 'directory' ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
            <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Our Esteemed Alumni</h2>
              </div>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search by name, profession, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-6">
              {loadingDirectory ? (
                <div className="flex flex-col items-center justify-center py-20 text-emerald-800">
                  <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium animate-pulse">Loading Alumni Directory...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {directoryData.filter(a => 
                    (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (a.profession || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (a.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (a.institution || '').toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((alumnus, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full pointer-events-none"></div>
                      
                      <div className="flex items-start gap-4 mb-4">
                        {alumnus.photoUrl ? (
                          <div className="w-16 h-20 rounded-md overflow-hidden border-2 border-emerald-100 shrink-0 shadow-sm">
                            <img src={alumnus.photoUrl} alt={alumnus.fullName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-20 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border-2 border-emerald-100 shrink-0 shadow-sm">
                            {alumnus.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-lg truncate" title={alumnus.fullName}>
                            {alumnus.fullName}
                          </h3>
                          <p className="text-emerald-700 text-sm font-medium truncate">
                            {alumnus.profession || 'Professional'}
                          </p>
                          {alumnus.company && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                              <Building2 size={12} className="shrink-0" />
                              <span className="truncate">{alumnus.company}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                          <GraduationCap size={14} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-700 line-clamp-1">{alumnus.institution}</p>
                            <p>{alumnus.degree} • Class of {alumnus.passingYear}</p>
                          </div>
                        </div>
                        {alumnus.location && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <MapPin size={14} className="text-amber-500 shrink-0" />
                            <span className="truncate">{alumnus.location}</span>
                          </div>
                        )}
                        {alumnus.linkedin && (
                          <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                            <Linkedin size={14} className="text-blue-600 shrink-0" />
                            <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {directoryData.length > 0 && directoryData.filter(a => 
                    (a.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (a.profession || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (a.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (a.institution || '').toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                      No alumni found matching your search criteria.
                    </div>
                  )}
                  
                  {directoryData.length === 0 && !loadingDirectory && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                      No alumni records available yet. Be the first to register!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:px-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <User size={16} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Complete Your Profile</h2>
              </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-10">
            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* SECTION 1: Personal Info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                <User size={16} /> 1. Personal Information & Photo
              </h3>
              
              {/* Photo Upload Section */}
              <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 relative">
                  {photoPreview ? (
                    <div className="relative w-24 h-32 rounded-lg overflow-hidden border-4 border-white shadow-md">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-32 rounded-lg bg-slate-200 border-4 border-white shadow-md flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon size={32} />
                      <span className="text-[10px] uppercase font-bold mt-1">No Photo</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-800 mb-1">Upload Profile Photo</h4>
                  <p className="text-xs text-slate-500 mb-3">Max size: 5MB. Formats: JPG, PNG. This photo will appear on your Alumni Certificate.</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-600 text-emerald-700 font-semibold rounded-lg text-sm cursor-pointer hover:bg-emerald-50 transition-colors">
                    <Upload size={16} />
                    <span>Choose Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Full Name *</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Mobile Number *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="10-digit number" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Academic Info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                <GraduationCap size={16} /> 2. Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Institution Attended (Under SSM) *</label>
                  <input type="text" name="institution" required value={formData.institution} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="e.g. Sardar Patel Mahavidyalaya" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Degree / Course *</label>
                  <input type="text" name="degree" required value={formData.degree} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="e.g. B.Sc, B.A., M.Com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Year of Passing *</label>
                  <input type="text" name="passingYear" required value={formData.passingYear} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="YYYY" />
                </div>
              </div>
            </div>

            {/* SECTION 3: Professional Info */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                <Briefcase size={16} /> 3. Current Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Current Profession</label>
                  <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="e.g. Software Engineer, Teacher, Business" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Company / Organization</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="Current workplace" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Designation</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="Your job title" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Current Location (City, Country)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="e.g. Pune, India" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase flex items-center gap-2">
                    <Linkedin size={14} className="text-[#0A66C2]" /> LinkedIn Profile (Optional)
                  </label>
                  <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            </div>

            {/* SECTION 4: Message */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-slate-200 pb-2 mb-6 flex items-center gap-2">
                <Mail size={16} /> 4. Message / Memories
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Any message for the institution? (Optional)</label>
                <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none" placeholder="Share a memory, achievement, or how the institution helped you..."></textarea>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button type="button" onClick={() => window.location.href = '/'} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Register as Alumni'}
                {!submitting && <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}
