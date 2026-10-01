import React, { useState, useEffect } from 'react';
import { Download, Search, CheckCircle2, MapPin, Briefcase, GraduationCap, Building2, Trash2 } from 'lucide-react';
import { useConfirm } from './ConfirmDialogContext';

export function AlumniAdmin() {
  const { confirm } = useConfirm();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterInstitution, setFilterInstitution] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch('/api/alumni', { headers });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
        return new Promise(() => {});
      }
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Failed to fetch alumni: ${res.status} ${errText}`);
      }
      const data = await res.json();
      setAlumni(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    const confirmed = await confirm({ title: 'Delete Record', message: 'Are you sure you want to delete this alumni record?' });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem('admin_token');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`/api/alumni/${id}`, { method: 'DELETE', headers });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin';
        return new Promise(() => {});
      }
      if (!res.ok) throw new Error('Failed to delete');
      
      setAlumni(prev => prev.filter(a => String(a.id) !== String(id)));
    } catch (err) {
      console.error(err);
      alert("Failed to delete alumni record.");
    }
  };

  const handleDownload = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'DOB', 'Gender', 'Institution', 'Passing Year', 'Degree', 'Profession', 'Company', 'Designation', 'Location', 'LinkedIn', 'Message', 'Photo URL', 'Registered At'];
    
    const rows = filteredAlumni.map(a => [
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.dob || '').replace(/"/g, '""')}"`,
      `"${(a.gender || '').replace(/"/g, '""')}"`,
      `"${(a.institution || '').replace(/"/g, '""')}"`,
      `"${(a.passingYear || '').replace(/"/g, '""')}"`,
      `"${(a.degree || '').replace(/"/g, '""')}"`,
      `"${(a.profession || '').replace(/"/g, '""')}"`,
      `"${(a.company || '').replace(/"/g, '""')}"`,
      `"${(a.designation || '').replace(/"/g, '""')}"`,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      `"${(a.linkedin || '').replace(/"/g, '""')}"`,
      `"${(a.message || '').replace(/"/g, '""')}"`,
      `"${(a.photoUrl ? window.location.origin + a.photoUrl : '').replace(/"/g, '""')}"`,
      `"${new Date(a.created_at).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Alumni_Data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const institutions = Array.from(new Set(alumni.map(a => a.institution).filter(Boolean)));
  const years = Array.from(new Set(alumni.map(a => a.passingYear).filter(Boolean))).sort().reverse();

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = (a.fullName?.toLowerCase() || '').includes(search.toLowerCase()) || 
                          (a.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
                          (a.company?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesInst = filterInstitution ? a.institution === filterInstitution : true;
    const matchesYear = filterYear ? a.passingYear === filterYear : true;
    return matchesSearch && matchesInst && matchesYear;
  });

  if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-emerald-900 border-t-transparent rounded-full mx-auto"></div><p className="mt-4 text-slate-500">Loading Alumni Data...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800">Alumni Network</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and export registered alumni data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {alumni.length} Registered
          </div>
          <button onClick={handleDownload} className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-400 font-bold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <select 
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="">All Institutions</option>
            {institutions.map(inst => <option key={inst} value={inst}>{inst}</option>)}
          </select>
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          >
            <option value="">All Passing Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 font-bold">Alumni Profile</th>
                <th className="p-4 font-bold">Academic Detail</th>
                <th className="p-4 font-bold">Professional Detail</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold text-center">Joined</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlumni.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {a.photoUrl ? (
                        <div className="w-10 h-12 rounded-md overflow-hidden bg-slate-200 shrink-0">
                          <img src={a.photoUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-12 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                          {a.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-800">{a.fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{a.gender} • DOB: {a.dob || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-emerald-800 flex items-start gap-1.5">
                      <GraduationCap size={14} className="mt-0.5 shrink-0" />
                      <span>{a.degree} ({a.passingYear})</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1" title={a.institution}>{a.institution}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700 flex items-start gap-1.5">
                      <Briefcase size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <span>{a.designation || a.profession || 'Not Specified'}</span>
                    </div>
                    {a.company && (
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Building2 size={12} /> {a.company}
                      </div>
                    )}
                    {a.location && (
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> {a.location}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div><a href={`mailto:${a.email}`} className="text-blue-600 hover:underline">{a.email}</a></div>
                    <div className="mt-0.5">{a.phone}</div>
                    {a.linkedin && <div className="mt-1"><a href={a.linkedin} target="_blank" rel="noreferrer" className="text-xs text-[#0A66C2] hover:underline font-medium">LinkedIn Profile</a></div>}
                  </td>
                  <td className="p-4 text-center text-xs text-slate-500">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                      title="Delete Alumni Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAlumni.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 italic">No alumni records found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
