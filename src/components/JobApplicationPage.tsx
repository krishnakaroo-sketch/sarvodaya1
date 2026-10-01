import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, UploadCloud, AlertCircle, FileText, 
  User, GraduationCap, Briefcase, Phone, Mail, MapPin, 
  Printer, Download, Sparkles, Building2, Calendar, ShieldCheck,
  Award, Eye, X
} from 'lucide-react';
import { submitJobApplication } from '../lib/api';
import { MANDAL_INSTITUTIONS } from '../data/mandalData';

interface JobApplicationPageProps {
  career: {
    id: string;
    title: string;
    department: string;
    location: string;
    type?: string;
    description?: string;
    requirements?: string;
  } | null;
  onClose: () => void;
  isMarathi?: boolean;
}

interface QualificationItem {
  exam: string;
  degree: string;
  boardUniversity: string;
  passingYear: string;
  subjects: string;
  marksObtained: string;
  totalMarks: string;
  percentage: string;
  divisionGrade: string;
}

interface ExperienceItem {
  organization: string;
  designation: string;
  nature: string;
  fromDate: string;
  toDate: string;
  totalPeriod: string;
  payScale: string;
  reasonForLeaving: string;
}

export function JobApplicationPage({ career, onClose, isMarathi = false }: JobApplicationPageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Lock background scrolling and ensure modal starts at top
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 1. Post & Campus Preference
  const [selectedPosition, setSelectedPosition] = useState(career?.title || '');
  const [selectedDept, setSelectedDept] = useState(career?.department || '');
  const [institutionPreference, setInstitutionPreference] = useState(
    career?.location ? `Campus: ${career.location}` : 'Sardar Patel Mahavidyalaya, Chandrapur'
  );
  const [specialization, setSpecialization] = useState('');
  const [employmentType, setEmploymentType] = useState(career?.type || 'Full-Time');

  useEffect(() => {
    if (career) {
      if (career.title) setSelectedPosition(career.title);
      if (career.department) setSelectedDept(career.department);
      if (career.location) setInstitutionPreference(`Campus: ${career.location}`);
      if (career.type) setEmploymentType(career.type);
    }
  }, [career]);

  // 2. Personal Details
  const [fullNameEn, setFullNameEn] = useState('');
  const [fullNameMr, setFullNameMr] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('Unmarried');
  const [nationality, setNationality] = useState('Indian');
  const [domicile, setDomicile] = useState('Yes');
  const [category, setCategory] = useState('OPEN');
  const [casteName, setCasteName] = useState('');
  const [casteValidity, setCasteValidity] = useState('Available');
  const [isPwd, setIsPwd] = useState('No');
  const [pwdDetails, setPwdDetails] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  // 3. Contact Details
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [email, setEmail] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Chandrapur');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [sameAsPermanent, setSameAsPermanent] = useState(true);
  const [correspondenceAddress, setCorrespondenceAddress] = useState('');

  // 4. Qualifications
  const [qualifications, setQualifications] = useState<QualificationItem[]>([
    { exam: 'S.S.C. (10th)', degree: '10th Standard', boardUniversity: 'Maharashtra State Board', passingYear: '', subjects: 'All Subjects', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' },
    { exam: 'H.S.C. (12th)', degree: '12th Standard', boardUniversity: 'Maharashtra State Board', passingYear: '', subjects: 'Science / Arts / Commerce', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' },
    { exam: 'Graduation', degree: 'B.A. / B.Sc. / B.Com / B.Ed', boardUniversity: '', passingYear: '', subjects: '', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' },
    { exam: 'Post Graduation', degree: 'M.A. / M.Sc. / M.Com / M.Ed', boardUniversity: '', passingYear: '', subjects: '', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' },
    { exam: 'Eligibility (NET/SET/Ph.D.)', degree: 'NET / SET / Ph.D. / PET', boardUniversity: 'UGC / CSIR / Gondwana Univ', passingYear: '', subjects: '', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' }
  ]);

  // 5. Experience
  const [totalExperienceYears, setTotalExperienceYears] = useState('0');
  const [currentEmploymentStatus, setCurrentEmploymentStatus] = useState('Employed');
  const [currentOrganization, setCurrentOrganization] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    { organization: '', designation: '', nature: 'Full-Time (Approved)', fromDate: '', toDate: '', totalPeriod: '', payScale: '', reasonForLeaving: '' }
  ]);
  const [publications, setPublications] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  // 6. Files & Uploads
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>('');
  const [docFile, setDocFile] = useState<File | null>(null);

  // 7. Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [place, setPlace] = useState('Chandrapur');

  // Calculate age automatically on DOB change
  const handleDobChange = (value: string) => {
    setDob(value);
    if (value) {
      const birthDate = new Date(value);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(`${calculatedAge} Years`);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview('');
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSignatureFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview('');
    }
  };

  const handleQualChange = (index: number, field: keyof QualificationItem, val: string) => {
    const updated = [...qualifications];
    updated[index][field] = val;

    // Auto calculate percentage if marks given
    if (field === 'marksObtained' || field === 'totalMarks') {
      const obt = parseFloat(field === 'marksObtained' ? val : updated[index].marksObtained);
      const tot = parseFloat(field === 'totalMarks' ? val : updated[index].totalMarks);
      if (!isNaN(obt) && !isNaN(tot) && tot > 0) {
        updated[index].percentage = ((obt / tot) * 100).toFixed(2) + '%';
      }
    }
    setQualifications(updated);
  };

  const addQualificationRow = () => {
    setQualifications([
      ...qualifications,
      { exam: 'Other Qualification', degree: '', boardUniversity: '', passingYear: '', subjects: '', marksObtained: '', totalMarks: '', percentage: '', divisionGrade: '' }
    ]);
  };

  const removeQualificationRow = (index: number) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((_, i) => i !== index));
    }
  };

  const handleExpChange = (index: number, field: keyof ExperienceItem, val: string) => {
    const updated = [...experiences];
    updated[index][field] = val;
    setExperiences(updated);
  };

  const addExperienceRow = () => {
    setExperiences([
      ...experiences,
      { organization: '', designation: '', nature: 'Full-Time', fromDate: '', toDate: '', totalPeriod: '', payScale: '', reasonForLeaving: '' }
    ]);
  };

  const removeExperienceRow = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!declarationAccepted) {
      setErrorMsg(isMarathi ? 'कृपया अर्जातील हमीपत्र (Declaration) मान्य करा.' : 'Please accept the declaration agreement before submitting.');
      return;
    }

    if (!resumeFile) {
      setErrorMsg(isMarathi ? 'कृपया आपला अद्ययावत बायोडाटा / रेझ्युमे (Resume PDF) जोडा.' : 'Please upload your detailed Resume / CV (PDF or DOCX).');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('careerId', career?.id || '');
      formData.append('jobTitle', selectedPosition || 'General Application');
      formData.append('institutionPreference', institutionPreference);
      formData.append('specialization', specialization);
      formData.append('employmentType', employmentType);

      // Personal
      formData.append('name', fullNameEn);
      formData.append('nameMarathi', fullNameMr);
      formData.append('fatherOrHusbandName', fatherOrHusbandName);
      formData.append('motherName', motherName);
      formData.append('dob', dob);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('maritalStatus', maritalStatus);
      formData.append('nationality', nationality);
      formData.append('domicile', domicile);
      formData.append('category', category);
      formData.append('casteName', casteName);
      formData.append('casteValidity', casteValidity);
      formData.append('pwd', isPwd);
      formData.append('pwdDetails', pwdDetails);
      formData.append('aadhaar', aadhaar);
      formData.append('pan', pan);

      // Contact
      formData.append('email', email);
      formData.append('phone', mobile);
      formData.append('alternatePhone', altMobile);
      formData.append('address', permanentAddress);
      formData.append('city', city);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('pincode', pincode);
      formData.append('correspondenceAddress', sameAsPermanent ? permanentAddress : correspondenceAddress);

      // Academics & Experience
      formData.append('qualifications', JSON.stringify(qualifications));
      formData.append('experience', JSON.stringify(experiences));
      formData.append('totalExperienceYears', totalExperienceYears);
      formData.append('currentEmploymentStatus', currentEmploymentStatus);
      formData.append('currentOrganization', currentOrganization);
      formData.append('currentDesignation', currentDesignation);
      formData.append('publications', publications);
      formData.append('coverLetter', coverLetter);

      // Files
      if (resumeFile) formData.append('resume', resumeFile);
      if (photoFile) formData.append('photo', photoFile);
      if (signatureFile) formData.append('signature', signatureFile);
      if (docFile) formData.append('documents', docFile);

      const res = await submitJobApplication(formData);
      if (res && (res.success || res.id || res.applicationNumber)) {
        const appData = res.data || {
          applicationNumber: res.applicationNumber || `SSM-${new Date().getFullYear()}-REC-${Math.floor(10000 + Math.random() * 90000)}`,
          name: fullNameEn,
          jobTitle: selectedPosition || 'Employment Application',
          email,
          phone: mobile,
          category,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        };
        setSubmissionSuccess(appData);
        // Scroll to top of window and modal so user sees success message immediately
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const modal = document.getElementById('application-success-modal');
          if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
        try {
          const stored = JSON.parse(localStorage.getItem('ssm_submitted_applications') || '[]');
          stored.unshift(appData);
          localStorage.setItem('ssm_submitted_applications', JSON.stringify(stored.slice(0, 20)));
        } catch {}
      } else {
        throw new Error('Server could not confirm application record. Please try again.');
      }
    } catch (err: any) {
      console.error('Job application submission error:', err);
      let friendlyMsg = err.message || 'Error submitting application. Please try again.';
      if (friendlyMsg.includes('Unexpected token') || friendlyMsg.includes('<!doctype') || friendlyMsg.includes('<!DOCTYPE')) {
        friendlyMsg = isMarathi 
          ? 'सर्व्हरशी संपर्क साधताना त्रुटी आली. कृपया पुन्हा अर्ज सबमिट करण्याचा प्रयत्न करा.'
          : 'Unable to establish secure communication with application server. Please try submitting again.';
      }
      setErrorMsg(friendlyMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWin = window.open('', '_blank', 'width=900,height=1000');
    if (!printWin) {
      alert('Please allow pop-ups to print the application form.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Application Form - ${fullNameEn || 'Candidate'}</title>
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
              <span>POSITION: ${(submissionSuccess?.jobTitle || selectedPosition || 'GENERAL RECRUITMENT').toUpperCase()} ${institutionPreference ? `(${institutionPreference})` : ''}</span>
              <span>APP NO: ${submissionSuccess?.applicationNumber || '-'}</span>
              <span>DATE: ${submissionSuccess?.date || new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          ${photoPreview ? `
            <div class="photo-box">
              <img src="${photoPreview}" alt="Photo" />
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
            <td class="value" colspan="3"><strong>${(submissionSuccess?.jobTitle || selectedPosition || 'GENERAL RECRUITMENT').toUpperCase()}</strong> ${institutionPreference ? `(${institutionPreference})` : ''}</td>
          </tr>
          <tr>
            <td class="label">Full Name (English):</td>
            <td class="value"><strong>${fullNameEn || '-'}</strong></td>
            <td class="label">Full Name (Marathi):</td>
            <td class="value"><strong>${fullNameMr || '-'}</strong></td>
          </tr>
          <tr>
            <td class="label">Father's / Husband's Name:</td>
            <td class="value">${fatherOrHusbandName || '-'}</td>
            <td class="label">Mother's Name:</td>
            <td class="value">${motherName || '-'}</td>
          </tr>
          <tr>
            <td class="label">Date of Birth & Age:</td>
            <td class="value">${dob || '-'} (${age ? `${age} Yrs` : '-'})</td>
            <td class="label">Gender & Marital Status:</td>
            <td class="value">${gender || '-'} • ${maritalStatus || '-'}</td>
          </tr>
          <tr>
            <td class="label">Category & Caste:</td>
            <td class="value"><strong>${category || '-'}</strong> (${casteName || '-'})</td>
            <td class="label">Aadhaar & PAN Number:</td>
            <td class="value">${aadhaar || '-'} • ${pan || '-'}</td>
          </tr>
        </table>

        <div class="section-title">2. Contact & Address Details</div>
        <table class="info-grid">
          <tr>
            <td class="label">Mobile Number:</td>
            <td class="value"><strong>${mobile || '-'}</strong></td>
            <td class="label">Alternate Mobile:</td>
            <td class="value">${altMobile || '-'}</td>
          </tr>
          <tr>
            <td class="label">Email Address:</td>
            <td class="value">${email || '-'}</td>
            <td class="label">Location:</td>
            <td class="value">${city || '-'}, ${district || '-'}</td>
          </tr>
          <tr>
            <td class="label">Permanent Address:</td>
            <td class="value" colspan="3">${permanentAddress || '-'}, ${state || '-'} - ${pincode || '-'}</td>
          </tr>
        </table>

        <div class="section-title">3. Educational Qualifications</div>
        ${qualifications.filter(q => q.degree || q.passingYear).length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Exam / Degree</th>
                <th>Board / University</th>
                <th>Passing Year</th>
                <th>Subjects / Specialization</th>
                <th>% / Grade</th>
              </tr>
            </thead>
            <tbody>
              ${qualifications.filter(q => q.degree || q.passingYear).map(q => `
                <tr>
                  <td><strong>${q.exam || '-'}</strong> ${q.degree ? `(${q.degree})` : ''}</td>
                  <td>${q.boardUniversity || '-'}</td>
                  <td>${q.passingYear || '-'}</td>
                  <td>${q.subjects || '-'}</td>
                  <td><strong>${q.percentage || q.divisionGrade || '-'}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p style="font-size: 11px; color: #64748b; font-style: italic;">No educational qualifications provided.</p>'}

        <div class="section-title">4. Professional Experience</div>
        ${experiences.filter(e => e.organization).length > 0 ? `
          <table class="data-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Designation</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Period</th>
                <th>Nature of Work / Pay Scale</th>
              </tr>
            </thead>
            <tbody>
              ${experiences.filter(e => e.organization).map(e => `
                <tr>
                  <td><strong>${e.organization || '-'}</strong></td>
                  <td>${e.designation || '-'}</td>
                  <td>${e.fromDate || '-'}</td>
                  <td>${e.toDate || 'Present'}</td>
                  <td>${e.totalPeriod || '-'}</td>
                  <td>${e.nature || '-'} / ${e.payScale || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p style="font-size: 11px; color: #64748b; font-style: italic;">No professional experience provided.</p>'}

        <div class="signature-section" style="page-break-inside: avoid;">
          <div style="font-size: 11px;">
            <p style="margin: 2px 0;"><strong>Place:</strong> ${place || district || 'Chandrapur'}</p>
            <p style="margin: 2px 0;"><strong>Date:</strong> ${submissionSuccess?.date || new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <div class="sig-box">
            ${signaturePreview ? `
              <img src="${signaturePreview}" alt="Signature" style="height: 40px; object-fit: contain; margin-bottom: 4px;" /><br>
            ` : ''}
            ${fullNameEn || 'Candidate'}
            <br>
            <span style="font-weight: normal; font-size: 9px; color: #64748b;">(Candidate Signature)</span>
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
    }
  };

  // SUCCESS ACKNOWLEDGEMENT SCREEN
  if (submissionSuccess) {
    return (
      <div id="application-success-modal" className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-100 text-slate-900 py-8 px-4 md:px-8 print:p-0 print:bg-white">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
          {/* Header */}
          <div className="bg-emerald-950 text-white p-8 text-center relative">
            <button 
              type="button"
              onClick={onClose} 
              className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-white/20 print:hidden"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">{isMarathi ? 'मागे जा' : 'Go Back'}</span>
            </button>

            <div className="w-16 h-16 bg-amber-400 text-emerald-950 rounded-full flex items-center justify-center mx-auto mb-4 mt-8 sm:mt-0 font-bold text-2xl shadow-lg">
              <CheckCircle2 size={36} className="text-emerald-950" />
            </div>
            <p className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">
              {isMarathi ? 'सर्वोदय शिक्षण मंडळ, चंद्रपूर' : 'Sarvodaya Shikshan Mandal, Chandrapur'}
            </p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">
              {isMarathi ? 'अर्ज यशस्वीरीत्या सादर झाला आहे!' : 'Application Submitted Successfully!'}
            </h1>
            <p className="text-emerald-200 text-sm mt-2 max-w-md mx-auto">
              {isMarathi 
                ? 'आपला भरती अर्ज यशस्वीरीत्या नोंदवला गेला आहे. पुढील संपर्कासाठी आपला अर्ज क्रमांक जपून ठेवा.' 
                : 'Your employment application has been recorded in our centralized recruitment database.'}
            </p>
          </div>

          {/* Acknowledgement Slip */}
          <div className="p-8 md:p-10 space-y-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  {isMarathi ? 'अधिकृत अर्ज नोंदणी क्रमांक' : 'Official Application Registration Number'}
                </span>
                <p className="text-3xl font-mono font-black text-emerald-950 tracking-wider mt-1">
                  {submissionSuccess.applicationNumber}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">
                  {isMarathi ? 'अर्जाची तारीख' : 'Submission Date'}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {submissionSuccess.date || new Date().toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* Candidate Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm">
              <div>
                <span className="text-slate-500 text-xs block mb-1 uppercase font-bold">{isMarathi ? 'उमेदवाराचे नाव' : 'Candidate Name'}</span>
                <p className="font-bold text-slate-800 text-base">{submissionSuccess.name || fullNameEn}</p>
                {fullNameMr && <p className="text-slate-600 text-xs mt-0.5">{fullNameMr}</p>}
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-1 uppercase font-bold">{isMarathi ? 'अर्ज केलेले पद' : 'Position Applied For'}</span>
                <p className="font-bold text-emerald-900 text-base">{submissionSuccess.jobTitle || selectedPosition}</p>
                <p className="text-xs text-slate-600">{institutionPreference}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-1 uppercase font-bold">{isMarathi ? 'मोबाईल व ईमेल' : 'Contact Details'}</span>
                <p className="font-medium text-slate-800">{mobile}</p>
                <p className="text-slate-600 text-xs">{email}</p>
              </div>
              <div>
                <span className="text-slate-500 text-xs block mb-1 uppercase font-bold">{isMarathi ? 'सामाजिक प्रवर्ग / जात' : 'Category & Status'}</span>
                <p className="font-bold text-slate-800">{category} {casteName ? `(${casteName})` : ''}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Status: Received / Under Review
                </span>
              </div>
            </div>

            {/* Next Steps Advisory */}
            <div className="border-l-4 border-emerald-800 bg-emerald-50/70 p-4 rounded-r-xl text-xs text-slate-700 leading-relaxed">
              <p className="font-bold text-emerald-950 mb-1">
                {isMarathi ? 'उमेदवारांसाठी महत्त्वाची सूचना:' : 'Important Notice for Candidate:'}
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  {isMarathi 
                    ? 'अर्जाची एक प्रत (Print / PDF) भविष्यातील पडताळणीसाठी सेव्ह करून ठेवा.' 
                    : 'Download or print this acknowledgment slip for your records and interview verification.'}
                </li>
                <li>
                  {isMarathi 
                    ? 'मुलाखतीची तारीख आणि पात्र उमेदवारांची यादी ईमेल / फोनद्वारे कळवण्यात येईल.' 
                    : 'Shortlisted candidates will be notified via email/SMS regarding interview dates and document verification.'}
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                {isMarathi ? 'मुख्य पानावर परत जा' : 'Back to Careers Page'}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                {isMarathi ? 'संपूर्ण अर्ज प्रिंट / सेव्ह करा' : 'Print / Save Full Application Form'}
              </button>
            </div>

            {/* Full Application Form (Print & Review Section) */}
            <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-300">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">
                  {isMarathi ? 'संपूर्ण अर्ज (Full Application Form)' : 'Full Application Form'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isMarathi ? 'अधिकृत नोंदणीसाठी उमेदवाराची प्रत' : 'Candidate Copy for Official Record'}
                </p>
              </div>

              {/* Flex Container for Details and Photo to ensure no overlap */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
                {/* Personal Details */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="flex flex-col sm:col-span-2 mb-2 pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Position Applied For</span>
                      <span className="font-bold text-emerald-900 mt-0.5 text-base">{submissionSuccess.jobTitle || selectedPosition} {institutionPreference ? `(${institutionPreference})` : ''}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Full Name (English)</span>
                      <span className="font-bold text-slate-900 mt-0.5">{fullNameEn}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Full Name (Marathi)</span>
                      <span className="font-bold text-slate-900 mt-0.5">{fullNameMr || '-'}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Father/Husband Name</span>
                      <span className="text-slate-900 mt-0.5">{fatherOrHusbandName}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Mother Name</span>
                      <span className="text-slate-900 mt-0.5">{motherName}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Date of Birth & Age</span>
                      <span className="text-slate-900 mt-0.5">{dob} ({age})</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Gender / Marital Status</span>
                      <span className="text-slate-900 mt-0.5">{gender} / {maritalStatus}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Category & Caste</span>
                      <span className="text-slate-900 mt-0.5">{category} {casteName ? `(${casteName})` : ''}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Aadhaar / PAN</span>
                      <span className="text-slate-900 mt-0.5">{aadhaar || '-'} / {pan || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Photograph Area (Ensures no overlap by using block-level side layout) */}
                <div className="shrink-0 w-32 h-40 border-2 border-slate-300 rounded overflow-hidden bg-slate-50 flex flex-col items-center justify-center p-1 print:border-slate-800 print:bg-transparent">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Candidate" className="w-full h-full object-cover rounded-sm block" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <div className="text-center">
                      <User size={32} className="mx-auto text-slate-300 mb-2" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase block px-2">Photograph Not Uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Mobile / Alt Mobile</span>
                    <span className="text-slate-900 mt-0.5">{mobile} / {altMobile || '-'}</span>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Email Address</span>
                    <span className="text-slate-900 mt-0.5">{email}</span>
                  </div>
                  
                  <div className="flex flex-col sm:col-span-2">
                    <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">Permanent Address</span>
                    <span className="text-slate-900 mt-0.5">{permanentAddress}, {city}, {district}, {state} - {pincode}</span>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="mb-6">
                <h3 className="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">Educational Qualifications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 print:bg-slate-200">
                        <th className="border border-slate-300 p-2 font-bold">Exam / Degree</th>
                        <th className="border border-slate-300 p-2 font-bold">Board / University</th>
                        <th className="border border-slate-300 p-2 font-bold">Passing Year</th>
                        <th className="border border-slate-300 p-2 font-bold">Subjects</th>
                        <th className="border border-slate-300 p-2 font-bold">% / Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qualifications.filter(q => q.passingYear || q.degree).map((q, idx) => (
                        <tr key={idx}>
                          <td className="border border-slate-300 p-2 font-medium">{q.exam} ({q.degree})</td>
                          <td className="border border-slate-300 p-2">{q.boardUniversity}</td>
                          <td className="border border-slate-300 p-2 text-center">{q.passingYear}</td>
                          <td className="border border-slate-300 p-2">{q.subjects}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{q.percentage || q.divisionGrade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">Professional Experience</h3>
                {experiences.some(e => e.organization) ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 print:bg-slate-200">
                          <th className="border border-slate-300 p-2 font-bold">Organization</th>
                          <th className="border border-slate-300 p-2 font-bold">Designation</th>
                          <th className="border border-slate-300 p-2 font-bold">Duration</th>
                          <th className="border border-slate-300 p-2 font-bold">Nature / Pay Scale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experiences.filter(e => e.organization).map((e, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-300 p-2 font-medium">{e.organization}</td>
                            <td className="border border-slate-300 p-2">{e.designation}</td>
                            <td className="border border-slate-300 p-2 whitespace-nowrap">{e.fromDate} to {e.toDate || 'Present'}<br/><span className="text-[10px] text-slate-500">({e.totalPeriod})</span></td>
                            <td className="border border-slate-300 p-2">{e.nature}<br/><span className="text-[10px]">{e.payScale}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No professional experience listed.</p>
                )}
              </div>
              
              {/* Declaration block in print */}
              <div className="mt-12 pt-8 border-t border-slate-200" style={{ pageBreakInside: 'avoid' }}>
                <p className="text-xs text-justify text-slate-700 leading-relaxed">
                  <strong>Declaration:</strong> I hereby declare that all the statements made in this application are true, complete and correct to the best of my knowledge and belief. In the event of any information being found false or incorrect, or ineligibility being detected before or after the interview/appointment, my candidature will stand cancelled and all my claims for the recruitment will be forfeited.
                </p>
                <div className="flex justify-between items-end mt-16">
                  <div>
                    <p className="text-sm"><strong>Place:</strong> {place || district || 'Chandrapur'}</p>
                    <p className="text-sm mt-1"><strong>Date:</strong> {submissionSuccess.date || new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-center flex flex-col items-center">
                    {signaturePreview ? (
                      <img src={signaturePreview} alt="Signature" className="h-12 object-contain mb-1" />
                    ) : (
                      <div className="w-48 border-b border-slate-400 mb-2 mx-auto"></div>
                    )}
                    <p className="text-sm font-bold">{fullNameEn}</p>
                    <p className="text-xs text-slate-500">(Signature of Candidate)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // MAIN FULL PAGE APPLICATION FORM
  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-slate-100 text-slate-800 font-sans pb-24">
      {/* Top Fixed Sticky Header */}
      <header className="sticky top-0 z-40 bg-emerald-950 text-white shadow-md border-b border-emerald-900/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-900 rounded-lg text-amber-400 transition-colors"
              title={isMarathi ? 'मागे जा' : 'Go back'}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-bold block">
                {isMarathi ? 'सर्वोदय शिक्षण मंडळ, चंद्रपूर' : 'Sarvodaya Shikshan Mandal, Chandrapur'}
              </span>
              <h1 className="text-base sm:text-lg font-serif font-bold text-white truncate max-w-sm sm:max-w-md">
                {isMarathi ? 'अधिकृत भरती अर्ज' : 'Employment Application Form'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {career && (
              <span className="hidden sm:inline-flex px-3 py-1 bg-emerald-900/80 border border-emerald-700 text-amber-300 text-xs font-bold rounded-full">
                {career.title}
              </span>
            )}
            <button
              onClick={onClose}
              className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              {isMarathi ? 'रद्द करा' : 'Cancel'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Banner Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider rounded-full border border-amber-200 mb-2">
                <Sparkles size={13} className="text-amber-600" />
                {isMarathi ? 'केंद्रीय भरती प्रक्रिया २०२६' : 'Central Recruitment Session 2026'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                {selectedPosition || (isMarathi ? 'पदासाठी सविस्तर अर्ज' : 'Detailed Job Application')}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                {isMarathi 
                  ? 'कृपया सर्व शैक्षणिक, वैयक्तिक आणि अनुभवाचा तपशील अचूक भरा. आवश्यक कागदपत्रे जोडा.' 
                  : 'Please enter your complete personal, educational, and professional credentials below.'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 shrink-0">
              <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-700" />
                {isMarathi ? 'रजि. नं. F-09 (C) चंद्रपूर' : 'Reg. No. F-09 (C) Chandrapur'}
              </p>
              <p>{isMarathi ? '११ महाविद्यालये व शाळा संकुल' : 'Network of 11 Premier Institutions'}</p>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={20} className="shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* =========================================================================
              SECTION 1: POSITION & CAMPUS SELECTION
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-800">
                {isMarathi ? 'अर्ज केलेले पद व संस्था प्राधान्य' : 'Position Applied For & Campus Preference'}
              </h3>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'पदाचे नाव (Position / Post Applied For) *' : 'Post Applied For *'}
                </label>
                <input
                  type="text"
                  required
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  placeholder="e.g. Assistant Professor in Physics / Principal / Clerk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'विषय / विद्याशाखा (Subject / Specialization)' : 'Subject / Discipline / Faculty'}
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Marathi, Physics, Commerce, Law, Computer Science"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'संस्था / कॅम्पस प्राधान्य (Institution Preference) *' : 'Institution / College Campus Preference *'}
                </label>
                <select
                  value={institutionPreference}
                  onChange={(e) => setInstitutionPreference(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="Any Institution under Mandal (मंडळांतर्गत कोणतीही संस्था)">Any Institution under Mandal (मंडळांतर्गत कोणतीही संस्था)</option>
                  <option value="Central Administrative Office, Chandrapur">Central Administrative Office, Chandrapur</option>
                  {MANDAL_INSTITUTIONS.map((inst) => (
                    <option key={inst.id} value={`${inst.nameMarathi} (${inst.nameEnglish})`}>
                      #{inst.id} - {inst.nameMarathi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'नोकरीचे स्वरूप (Nature of Post)' : 'Employment Nature'}
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                >
                  <option value="Full-Time (अनुदानित/Grant-in-Aid)">Full-Time (अनुदानित/Grant-in-Aid)</option>
                  <option value="Full-Time (विनाअनुदानित/Non-Grant)">Full-Time (विनाअनुदानित/Non-Grant)</option>
                  <option value="Clock Hour Basis (CHB तासिका तत्त्वावर)">Clock Hour Basis (CHB तासिका तत्त्वावर)</option>
                  <option value="Contract / Ad-hoc">Contract / Ad-hoc</option>
                </select>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: PERSONAL DETAILS & IDENTITY
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800">
                  {isMarathi ? 'उमेदवाराची वैयक्तिक माहिती (Personal & Identity Details)' : 'Personal Details & Identity'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Mandatory Details</span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'पूर्ण नाव (इंग्रजी - मोठ्या अक्षरात) *' : 'Full Name (In BLOCK LETTERS) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    placeholder="SURNAME FIRSTNAME MIDDLENAME"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'पूर्ण नाव (मराठीत - देवनागरी) *' : 'Full Name (In Devanagari / Marathi) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullNameMr}
                    onChange={(e) => setFullNameMr(e.target.value)}
                    placeholder="उदा. पोरेड्डीवार अरविंद नामदेवराव"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? "वडिलांचे / पतीचे नाव *" : "Father's / Husband's Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    placeholder="Father / Husband Full Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? "आईचे नाव *" : "Mother's Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Mother's Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* DOB, Age, Gender, Marital Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'जन्मतारीख (Date of Birth) *' : 'Date of Birth *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'वय (Age as of Today)' : 'Current Age'}
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={age}
                    placeholder="Auto-calculated"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'लिंग (Gender) *' : 'Gender *'}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (स्त्री)</option>
                    <option value="Transgender">Other (इतर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'वैवाहिक स्थिती *' : 'Marital Status *'}
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Unmarried">Unmarried (अविवाहित)</option>
                    <option value="Married">Married (विवाहित)</option>
                    <option value="Widowed/Divorced">Other</option>
                  </select>
                </div>
              </div>

              {/* Category, Caste, Caste Validity, Divyang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'सामाजिक प्रवर्ग (Category) *' : 'Social Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="OPEN">OPEN / General</option>
                    <option value="SC">SC (अ.जा.)</option>
                    <option value="ST">ST (अ.ज.)</option>
                    <option value="VJ-A">VJ / NT-A (वि.जा.-अ)</option>
                    <option value="NT-B">NT-B (भ.ज.-ब)</option>
                    <option value="NT-C">NT-C (भ.ज.-क)</option>
                    <option value="NT-D">NT-D (भ.ज.-ड)</option>
                    <option value="OBC">OBC (इ.मा.व.)</option>
                    <option value="SBC">SBC (वि.मा.प्र.)</option>
                    <option value="EWS">EWS (ई.डब्ल्यू.एस.)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'जात / उपजात (Caste & Subcaste)' : 'Caste & Sub-Caste'}
                  </label>
                  <input
                    type="text"
                    value={casteName}
                    onChange={(e) => setCasteName(e.target.value)}
                    placeholder="e.g. Maratha, Kunbi, Gond, Mahar, Teli"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'जात वैधता प्रमाणपत्र (Validity)' : 'Caste Validity Certificate'}
                  </label>
                  <select
                    value={casteValidity}
                    onChange={(e) => setCasteValidity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Available">Available (उपलब्ध आहे)</option>
                    <option value="Applied / In Process">Applied (प्रक्रियेत आहे)</option>
                    <option value="Not Applicable">Not Applicable (लागू नाही)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'दिव्यांग व्यक्ती (PwD)?' : 'Person with Disability (PwD)?'}
                  </label>
                  <select
                    value={isPwd}
                    onChange={(e) => setIsPwd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="No">No (नाही)</option>
                    <option value="Yes - Visual">Yes - Visual Impairment</option>
                    <option value="Yes - Hearing">Yes - Hearing Impairment</option>
                    <option value="Yes - Locomotor">Yes - Locomotor Disability</option>
                    <option value="Yes - Other">Yes - Other Disability</option>
                  </select>
                </div>
              </div>

              {/* Aadhaar, PAN, Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'आधार कार्ड क्रमांक (Aadhaar No.) *' : 'Aadhaar Card Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder="12 digit Aadhaar Number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'पॅन कार्ड क्रमांक (PAN No.)' : 'PAN Card Number'}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'महाराष्ट्राचा अधिवास (Domicile)?' : 'Maharashtra Domicile?'}
                  </label>
                  <select
                    value={domicile}
                    onChange={(e) => setDomicile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Yes">Yes (होय - महाराष्ट्र अधिवास)</option>
                    <option value="No">No (नाही)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: CONTACT & COMMUNICATION ADDRESS
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-800">
                {isMarathi ? 'संपर्क व पत्ता (Contact & Residential Address)' : 'Contact & Communication Details'}
              </h3>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'प्राथमिक मोबाईल नंबर *' : 'Primary Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Mobile"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'पर्यायी संपर्क नंबर (WhatsApp)' : 'Alternate / WhatsApp Phone'}
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={altMobile}
                    onChange={(e) => setAltMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Alternate Mobile"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'ईमेल पत्ता (Email Address) *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'कायमचा निवासी पत्ता (Permanent Address) *' : 'Permanent Address *'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  placeholder="Plot/Flat No., Street, Landmark, Area..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'शहर / गाव (City / Village) *' : 'City / Village *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Chandrapur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'जिल्हा (District) *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Chandrapur"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'राज्य (State) *' : 'State *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'पिन कोड (PIN Code) *' : 'PIN Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 442401"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Correspondence Address toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={sameAsPermanent}
                    onChange={(e) => setSameAsPermanent(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>
                    {isMarathi 
                      ? 'पत्रव्यवहाराचा पत्ता कायमच्या पत्त्यासारखाच आहे (Correspondence Address same as Permanent)' 
                      : 'Correspondence Address is same as Permanent Address'}
                  </span>
                </label>

                {!sameAsPermanent && (
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {isMarathi ? 'पत्रव्यवहाराचा पत्ता (Correspondence / Postal Address)' : 'Correspondence Address'}
                    </label>
                    <textarea
                      rows={2}
                      value={correspondenceAddress}
                      onChange={(e) => setCorrespondenceAddress(e.target.value)}
                      placeholder="Postal address for communications..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 4: EDUCATIONAL & ACADEMIC QUALIFICATIONS
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-800">
                    {isMarathi ? 'शैक्षणिक पात्रता (Educational Qualifications)' : 'Educational Qualifications'}
                  </h3>
                  <p className="text-xs text-slate-500">From SSC (10th) up to Highest Degree, NET, SET, Ph.D.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addQualificationRow}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Qualification
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="p-3">Examination / Level</th>
                    <th className="p-3">Board / University</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Main Subjects / Specialization</th>
                    <th className="p-3">Marks (Obt / Total)</th>
                    <th className="p-3">Percentage / Grade</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {qualifications.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800 min-w-[140px]">
                        <input
                          type="text"
                          value={q.exam}
                          onChange={(e) => handleQualChange(idx, 'exam', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-slate-800"
                        />
                      </td>
                      <td className="p-2.5 min-w-[160px]">
                        <input
                          type="text"
                          value={q.boardUniversity}
                          onChange={(e) => handleQualChange(idx, 'boardUniversity', e.target.value)}
                          placeholder="Board / University"
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                        />
                      </td>
                      <td className="p-2.5 w-20">
                        <input
                          type="text"
                          maxLength={4}
                          value={q.passingYear}
                          onChange={(e) => handleQualChange(idx, 'passingYear', e.target.value)}
                          placeholder="YYYY"
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-center"
                        />
                      </td>
                      <td className="p-2.5 min-w-[140px]">
                        <input
                          type="text"
                          value={q.subjects}
                          onChange={(e) => handleQualChange(idx, 'subjects', e.target.value)}
                          placeholder="e.g. Physics, Math"
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                        />
                      </td>
                      <td className="p-2.5 min-w-[120px]">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={q.marksObtained}
                            onChange={(e) => handleQualChange(idx, 'marksObtained', e.target.value)}
                            placeholder="Obt"
                            className="w-14 bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-center"
                          />
                          <span>/</span>
                          <input
                            type="text"
                            value={q.totalMarks}
                            onChange={(e) => handleQualChange(idx, 'totalMarks', e.target.value)}
                            placeholder="Tot"
                            className="w-14 bg-slate-50 border border-slate-200 p-2 rounded-lg font-mono text-center"
                          />
                        </div>
                      </td>
                      <td className="p-2.5 w-24">
                        <input
                          type="text"
                          value={q.percentage}
                          onChange={(e) => handleQualChange(idx, 'percentage', e.target.value)}
                          placeholder="e.g. 78%"
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-bold text-center text-emerald-800"
                        />
                      </td>
                      <td className="p-2.5 text-right">
                        {qualifications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQualificationRow(idx)}
                            className="text-red-400 hover:text-red-600 p-1.5"
                            title="Remove row"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================================================
              SECTION 5: TEACHING / WORK EXPERIENCE & PUBLICATIONS
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-800">
                    {isMarathi ? 'कामाचा व अध्यापनाचा अनुभव (Work & Teaching Experience)' : 'Teaching & Professional Experience'}
                  </h3>
                  <p className="text-xs text-slate-500">Service record in approved/non-approved institutions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addExperienceRow}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Experience
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'एकूण अनुभव (Total Experience)' : 'Total Experience'}
                  </label>
                  <input
                    type="text"
                    value={totalExperienceYears}
                    onChange={(e) => setTotalExperienceYears(e.target.value)}
                    placeholder="e.g. 5 Years 6 Months (or Fresher)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'सध्या कार्यरत असलेली संस्था' : 'Current Organization / College'}
                  </label>
                  <input
                    type="text"
                    value={currentOrganization}
                    onChange={(e) => setCurrentOrganization(e.target.value)}
                    placeholder="Present Institution"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isMarathi ? 'सध्याचे पद (Current Designation)' : 'Current Designation'}
                  </label>
                  <input
                    type="text"
                    value={currentDesignation}
                    onChange={(e) => setCurrentDesignation(e.target.value)}
                    placeholder="e.g. Lecturer, Asst. Prof, Clerk"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Experience Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <th className="p-3">College / School / Organization</th>
                      <th className="p-3">Designation</th>
                      <th className="p-3">Appointment Nature</th>
                      <th className="p-3">Period (From - To)</th>
                      <th className="p-3">Basic Pay / Gross Salary</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {experiences.map((exp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 min-w-[180px]">
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => handleExpChange(idx, 'organization', e.target.value)}
                            placeholder="College / Employer Name"
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                          />
                        </td>
                        <td className="p-2.5 min-w-[120px]">
                          <input
                            type="text"
                            value={exp.designation}
                            onChange={(e) => handleExpChange(idx, 'designation', e.target.value)}
                            placeholder="Designation"
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                          />
                        </td>
                        <td className="p-2.5 min-w-[120px]">
                          <select
                            value={exp.nature}
                            onChange={(e) => handleExpChange(idx, 'nature', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                          >
                            <option value="Approved Full-Time">Approved Full-Time</option>
                            <option value="Non-Grant Full-Time">Non-Grant Full-Time</option>
                            <option value="Clock Hour Basis (CHB)">CHB</option>
                            <option value="Temporary / Ad-hoc">Temporary</option>
                          </select>
                        </td>
                        <td className="p-2.5 min-w-[160px]">
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={exp.fromDate}
                              onChange={(e) => handleExpChange(idx, 'fromDate', e.target.value)}
                              placeholder="From (YYYY)"
                              className="w-20 bg-slate-50 border border-slate-200 p-2 rounded-lg text-center"
                            />
                            <span>-</span>
                            <input
                              type="text"
                              value={exp.toDate}
                              onChange={(e) => handleExpChange(idx, 'toDate', e.target.value)}
                              placeholder="To (YYYY)"
                              className="w-20 bg-slate-50 border border-slate-200 p-2 rounded-lg text-center"
                            />
                          </div>
                        </td>
                        <td className="p-2.5 min-w-[100px]">
                          <input
                            type="text"
                            value={exp.payScale}
                            onChange={(e) => handleExpChange(idx, 'payScale', e.target.value)}
                            placeholder="Salary / Scale"
                            className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          {experiences.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeExperienceRow(idx)}
                              className="text-red-400 hover:text-red-600 p-1.5"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Research Publications & Achievements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi 
                    ? 'संशोधन निबंध, पुस्तके, परिषद सहभाग व इतर विशेष यश (Research Publications, Books, Awards)' 
                    : 'Research Publications, Books Published, Conferences Attended, Special Achievements'}
                </label>
                <textarea
                  rows={3}
                  value={publications}
                  onChange={(e) => setPublications(e.target.value)}
                  placeholder="Mention UGC CARE / Scopus papers, seminars, Ph.D. guidance, or sports/cultural honors..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                ></textarea>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 6: UPLOADS & ATTACHMENTS
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-800">
                  {isMarathi ? 'कागदपत्रे व बायोडाटा अपलोड (Documents & Resume Upload)' : 'Document & Resume Uploads'}
                </h3>
                <p className="text-xs text-slate-500">Upload your latest resume, photograph, and certificates</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Resume Upload */}
                <div className="p-5 bg-emerald-50/50 border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                      1. Resume / CV (PDF) *
                    </span>
                    <p className="text-xs text-slate-500 mb-4">
                      Upload detailed CV with all career milestones (Max 15MB).
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-800 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    />
                    {resumeFile && (
                      <p className="text-xs font-bold text-emerald-800 mt-2 truncate flex items-center gap-1">
                        <CheckCircle2 size={13} /> {resumeFile.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Photo Upload */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      2. Passport Photograph
                    </span>
                    <p className="text-xs text-slate-500 mb-3">
                      Recent color passport photo (JPG/PNG).
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Candidate Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Signature Upload */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      3. Candidate Signature
                    </span>
                    <p className="text-xs text-slate-500 mb-3">
                      Clear signature on white paper (JPG/PNG).
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 h-10 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center bg-white">
                      {signaturePreview ? (
                        <img src={signaturePreview} alt="Signature Preview" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Sign</span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureChange}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Combined Certificates PDF */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      4. Combined Certificates (PDF)
                    </span>
                    <p className="text-xs text-slate-500 mb-4">
                      Combined PDF of Marksheets, NET/SET, Caste Validity (Optional).
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                    />
                    {docFile && (
                      <p className="text-xs font-bold text-slate-800 mt-2 truncate flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" /> {docFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isMarathi ? 'कव्हर लेटर / स्व-परिचय (Cover Letter / Self Introduction)' : 'Cover Letter / Statement of Purpose (Optional)'}
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Share details about your academic vision, teaching philosophy, or why you are applying to Sarvodaya Shikshan Mandal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                ></textarea>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 7: STATUTORY DECLARATION & SUBMISSION
             ========================================================================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-800">
                {isMarathi ? 'हमीपत्र व अर्ज सादर करणे (Declaration & Submission)' : 'Statutory Declaration & Submission'}
              </h3>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                <p className="font-bold text-amber-950 mb-2">
                  {isMarathi ? 'उमेदवाराचे स्वयंघोषणा हमीपत्र (Candidate Self Declaration):' : 'Candidate Statutory Declaration:'}
                </p>
                <p>
                  {isMarathi 
                    ? 'मी याद्वारे घोषित करतो/करते की, या अर्जात नमूद केलेली सर्व माहिती माझ्या माहितीनुसार व विश्वासाप्रमाणे पूर्णपणे सत्य आणि अचूक आहे. कोणत्याही टप्प्यावर कोणतीही माहिती खोटी किंवा विसंगत आढळल्यास माझी उमेदवारी किंवा नियुक्ती कोणतीही पूर्वसूचना न देता रद्द होण्यास पात्र राहील याची मला जाणीव आहे.'
                    : 'I hereby declare that all statements made in this application are true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false, fraudulent, or incorrect at any stage, my candidature/appointment shall be liable to immediate cancellation without notice.'}
                </p>

                <div className="mt-4 pt-3 border-t border-amber-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declarationCheckbox"
                    required
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="w-5 h-5 text-emerald-700 rounded mt-0.5 cursor-pointer shrink-0"
                  />
                  <label htmlFor="declarationCheckbox" className="font-bold text-emerald-950 cursor-pointer select-none">
                    {isMarathi 
                      ? 'मी वरील सर्व नियम व अटी वाचल्या असून त्या मला पूर्णपणे मान्य आहेत. (I accept all terms & declaration) *' 
                      : 'I have read and fully accept the above declaration and understand that my application will be scrutinized. *'}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {isMarathi ? 'ठिकाण (Place)' : 'Place'}
                    </label>
                    <input
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      {isMarathi ? 'दिनांक (Date)' : 'Date'}
                    </label>
                    <span className="inline-block bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-700">
                      {new Date().toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-sm transition-colors"
                  >
                    {isMarathi ? 'मागे जा' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold rounded-xl text-sm shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>{isMarathi ? 'नोंदणी होत आहे...' : 'Submitting Application...'}</span>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>{isMarathi ? 'अर्ज अंतिम सादर करा (Submit Application)' : 'Submit Detailed Application'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
