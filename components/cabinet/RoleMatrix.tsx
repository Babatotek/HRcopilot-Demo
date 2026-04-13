import React from 'react';
import GlassCard from '../GlassCard';

const RoleMatrix: React.FC = () => {
  const roles = ['Super Admin', 'HR Manager', 'Finance Lead', 'Employee'];
  const permissions = [
    { resource: 'Employee Contracts', access: ['Full', 'Full', 'None', 'Own Only'] },
    { resource: 'Payroll Records', access: ['Full', 'Summary', 'Full', 'Own Only'] },
    { resource: 'Company Policies', access: ['Full', 'Full', 'Full', 'Read Only'] },
    { resource: 'Performance Reviews', access: ['Full', 'Full', 'None', 'Own Only'] },
  ];

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="text-xs font-black uppercase tracking-widest">Governance & Data Masking</h3>
        <p className="text-[10px] text-slate-500 mt-1">Data Masking based on User Roles</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
              {roles.map(role => (
                <th key={role} className="p-4 border-b border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 border-b border-slate-100 dark:border-white/5 text-xs font-bold text-slate-900 dark:text-white">{perm.resource}</td>
                {perm.access.map((acc, j) => (
                  <td key={j} className="p-4 border-b border-slate-100 dark:border-white/5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      acc === 'Full' ? 'bg-emerald-500/10 text-emerald-500' :
                      acc === 'None' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {acc}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-4 items-start">
        <div className="text-blue-500 text-xl">ℹ️</div>
        <div>
          <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Dynamic Data Masking Active</h4>
          <p className="text-[10px] text-blue-600/80 dark:text-blue-400/80 mt-1">When "Summary" or "Own Only" is applied, sensitive fields (like SSN, Salary) are automatically redacted in the document preview using AI OCR masking.</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default RoleMatrix;
