import React, { useState, useEffect } from 'react';
import { fetchAdmins, createAdmin, deleteAdmin } from '../lib/api';
import { Shield, Plus, Trash2, User } from 'lucide-react';
import { useConfirm } from './ConfirmDialogContext';

export function AdminsManager() {
  const { confirm } = useConfirm();
  const [admins, setAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createAdmin({ email, password, role });
      setSuccess('User created successfully');
      setEmail('');
      setPassword('');
      setRole('admin');
      loadAdmins();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (await confirm({ title: 'Delete User', message: 'Are you sure you want to delete this user?' })) {
      setError('');
      try {
        await deleteAdmin(id);
        setSuccess('User deleted successfully');
        loadAdmins();
      } catch (err: any) {
        setError(err.message || 'Failed to delete user');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading users...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">User Management</h1>
        <p className="text-slate-500 text-sm">
          Create and manage users for the admin panel. Master admins can create regular admins or other master admins.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-semibold">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 text-sm font-semibold">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-emerald-700" /> Create New User
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email / Username</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="admin">Regular Admin</option>
                  <option value="master">Master Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
              >
                <Shield size={16} /> Create User
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User / Email</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{admin.email}</p>
                            <p className="text-xs text-slate-500">ID: {admin.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          admin.role === 'master' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {admin.role === 'master' ? 'Master Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500 font-medium">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
