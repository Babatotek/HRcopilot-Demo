import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { Employees } from './components/Employees';
import { Attendance } from './components/Attendance';
import { RoleManagement } from './components/RoleManagement';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Employees' && <Employees />}
          {activeTab === 'Attendance' && <Attendance />}
          {activeTab === 'Role Management' && <RoleManagement />}
          {!['Dashboard', 'Employees', 'Attendance', 'Role Management'].includes(activeTab) && (
            <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400">
              <p className="text-xl font-bold italic uppercase tracking-widest">Module Under Development</p>
              <p className="text-sm mt-2">The {activeTab} module is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
