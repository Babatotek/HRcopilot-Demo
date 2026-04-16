
import React, { useState } from 'react';
import { Shield, Edit, Plus, Search, MoreHorizontal } from 'lucide-react';
import GlassCard from '../components/GlassCard';

interface Role {
  id: string;
  title: string;
  description: string;
  scope: string;
  permissions: number;
  status: 'ACTIVE' | 'INACTIVE';
  isSystem: boolean;
}

const MOCK_ROLES: Role[] = [
  { id: '1', title: 'SUPER_ADMIN', description: 'Full system access with all permissions', scope: 'ALL', permissions: 80, status: 'ACTIVE', isSystem: true },
  { id: '2', title: 'CEO', description: 'Executive level oversight and organizational reporting', scope: 'ALL', permissions: 72, status: 'ACTIVE', isSystem: true },
  { id: '3', title: 'HR_MANAGER', description: 'HR operations and employee management', scope: 'ALL', permissions: 61, status: 'ACTIVE', isSystem: true },
  { id: '4', title: 'BRANCH_MANAGER', description: 'Branch-level management and operations', scope: 'BRANCH', permissions: 30, status: 'ACTIVE', isSystem: true },
  { id: '5', title: 'DEPARTMENT_HEAD', description: 'Department-level management', scope: 'DEPARTMENT', permissions: 26, status: 'ACTIVE', isSystem: true },
  { id: '6', title: 'EMPLOYEE', description: 'Standard employee access', scope: 'SELF', permissions: 20, status: 'ACTIVE', isSystem: true },
];

interface PermissionItem {
  title: string;
  access: 'ALL ACCESS' | 'DEPARTMENT ACCESS' | 'NO ACCESS';
}

interface PermissionCategory {
  category: string;
  items: PermissionItem[];
}

const MOCK_PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    category: 'ANALYTICS',
    items: [{ title: 'View Analytics', access: 'ALL ACCESS' }],
  },
  {
    category: 'ATTENDANCE',
    items: [
      { title: 'View Attendance Reports', access: 'ALL ACCESS' },
      { title: 'Clock-in Geofence', access: 'ALL ACCESS' },
      { title: 'Edit Attendance', access: 'NO ACCESS' },
      { title: 'Edit Attendance Settings', access: 'NO ACCESS' },
      { title: 'View Dashboard', access: 'ALL ACCESS' },
    ],
  },
  {
    category: 'BRANCH',
    items: [
      { title: 'Add Branch', access: 'NO ACCESS' },
      { title: 'Edit Branch', access: 'NO ACCESS' },
      { title: 'Delete Branch', access: 'NO ACCESS' },
      { title: 'View Branch', access: 'ALL ACCESS' },
    ],
  },
  {
    category: 'CRM',
    items: [
      { title: 'View Leads', access: 'ALL ACCESS' },
      { title: 'Edit Leads', access: 'NO ACCESS' },
      { title: 'Manage Clients', access: 'DEPARTMENT ACCESS' },
    ],
  },
  {
    category: 'DASHBOARD',
    items: [
      { title: 'View Overview', access: 'ALL ACCESS' },
      { title: 'Edit Widgets', access: 'NO ACCESS' },
    ],
  },
  {
    category: 'PAYROLL',
    items: [
      { title: 'Run Payroll', access: 'NO ACCESS' },
      { title: 'View Remittances', access: 'ALL ACCESS' },
      { title: 'Approve Disbursements', access: 'NO ACCESS' },
      { title: 'View Tax Figures', access: 'ALL ACCESS' },
    ],
  },
];

interface Designation {
  id: string;
  title: string;
  department: string;
  level: string;
  count: number;
}

const MOCK_DESIGNATIONS: Designation[] = [
  { id: 'd1', title: 'Senior Software Engineer', department: 'Engineering', level: 'L5', count: 12 },
  { id: 'd2', title: 'HR Specialist', department: 'Human Resources', level: 'L3', count: 4 },
  { id: 'd3', title: 'Finance Controller', department: 'Finance', level: 'L6', count: 2 },
  { id: 'd4', title: 'Procurement Officer', department: 'Supply Chain', level: 'L4', count: 6 },
  { id: 'd5', title: 'Product Manager', department: 'Product', level: 'L5', count: 8 },
  { id: 'd6', title: 'Marketing Lead', department: 'Growth', level: 'L6', count: 3 },
];

const RoleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ROLES');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = MOCK_ROLES.filter(role => 
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPermissions = MOCK_PERMISSION_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const filteredDesignations = MOCK_DESIGNATIONS.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            Role <span className="text-[#0047cc]">Management</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 italic opacity-70">
            ACCESS CONTROL & PERMISSION HUB
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#0047cc] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all w-full sm:w-auto justify-center">
          <Plus size={16} strokeWidth={3} />
          CREATE ROLE
        </button>
      </div>

      {/* Tabs Section */}
      <div className="tab-nav border-b border-slate-200 dark:border-white/5">
        {['ROLES', 'PERMISSIONS', 'DESIGNATIONS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all whitespace-nowrap flex-shrink-0 px-1 mr-6 sm:mr-10 ${
              activeTab === tab 
                ? 'text-slate-900 dark:text-white' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {tab} {tab === 'ROLES' && <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-md text-[9px] opacity-60">{MOCK_ROLES.length}</span>}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0047cc] rounded-full shadow-[0_0_12px_#0047cc]" />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar (Optional but good for UX) */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search roles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#e0f2fe]0/20 transition-all"
        />
      </div>

      {/* Active Tab Content */}
      {activeTab === 'ROLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <GlassCard key={role.id} className="p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-white/5">
              <div className="p-4 sm:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase italic group-hover:text-[#0047cc] transition-colors">
                    {role.title.replace('_', ' ')}
                  </h3>
                  {role.isSystem && (
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded-md border border-blue-100 dark:border-blue-500/20">
                      SYSTEM
                    </span>
                  )}
                </div>
                
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed min-h-[40px]">
                  {role.description}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50 dark:border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">SCOPE</p>
                    <span className="px-2 py-1 bg-[#e0f2fe] dark:bg-[#e0f2fe]0/10 text-[#0369a1] dark:text-[#0ea5e9] text-[9px] font-black uppercase rounded-md">
                      {role.scope}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ACCESS</p>
                    <p className="text-sm font-black text-emerald-500">{role.permissions}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">STATUS</p>
                    <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-md">
                      {role.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <button className="flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all border-r border-slate-100 dark:border-white/5">
                  <Shield size={12} className="text-[#0047cc]" />
                  PERMISSIONS
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                  <Edit size={12} />
                  EDIT
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'PERMISSIONS' && (
        <div className="space-y-10">
          {/* Permission Alert Box */}
          <div className="p-4 bg-blue-50/50 dark:bg-[#1e1b4b]/30 border border-blue-100 dark:border-blue-500/10 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-[#0047cc]">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-800 dark:text-gray-200 uppercase tracking-tight mb-1">Manage Permissions for Selected Role</p>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">Configure module-wise visibility and interaction capabilities carefully as these affect organizational data security.</p>
            </div>
          </div>

          {/* Categorized Permissions */}
          {filteredPermissions.map((cat) => (
            <div key={cat.category} className="space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic border-l-4 border-[#0047cc] pl-4">
                  {cat.category}
                </h4>
                <div className="flex-1 h-px bg-slate-100 dark:bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item, idx) => (
                  <GlassCard key={idx} className="!p-5 group hover:border-[#0047cc]/30 transition-all border border-slate-100 dark:border-white/5">
                    <div className="flex justify-between items-center h-full">
                      <p className="text-[11px] font-black text-slate-700 dark:text-gray-200 uppercase tracking-tight group-hover:text-[#0047cc] transition-colors">{item.title}</p>
                      <span className={`px-2 py-1 text-[8px] font-black uppercase rounded-md tracking-wider ${
                        item.access === 'ALL ACCESS' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : item.access === 'DEPARTMENT ACCESS'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}>
                        {item.access}
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'DESIGNATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDesignations.map((d) => (
            <GlassCard key={d.id} className="relative group overflow-hidden hover:scale-[1.02] transition-transform">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[#0047cc]">
                    <Shield size={20} />
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 text-[10px] font-black rounded-lg">
                    {d.level}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase italic mb-1">{d.title}</h4>
                <p className="text-[9px] font-black text-[#0047cc] uppercase tracking-widest mb-4 opacity-70">{d.department}</p>
                
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Headcount</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{d.count}</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#0047cc]/5 rounded-full blur-2xl group-hover:bg-[#0047cc]/10 transition-colors" />
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleManagement;



