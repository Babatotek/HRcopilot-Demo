
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { DEMO_MEMOS, DEMO_CHAT_MESSAGES } from '../demoData';

interface MemoItem {
  id: string;
  sender: string;
  role: string;
  time: string;
  subject: string;
  snippet: string;
  avatar: string;
  isUnread?: boolean;
}

const MEMO_LIST: MemoItem[] = DEMO_MEMOS.map(m => ({
  id: m.id,
  sender: m.senderName,
  role: m.senderRole,
  time: m.timestamp.slice(11, 16),
  subject: m.subject,
  snippet: m.snippet,
  avatar: m.senderAvatar,
  isUnread: !m.isRead,
}));

const CHAT_LOG = DEMO_CHAT_MESSAGES.filter(c => c.channelId === 'general').map(c => ({
  id: c.id,
  sender: c.senderName,
  msg: c.message,
  time: c.timestamp.slice(11, 16),
  avatar: c.senderAvatar,
}));

const MemoSystem: React.FC = () => {
  const [selectedMemoId, setSelectedMemoId] = useState(MEMO_LIST[0]?.id ?? 'm1');
  const selectedMemo = DEMO_MEMOS.find(m => m.id === selectedMemoId) ?? DEMO_MEMOS[0];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white dark:bg-[#0f172a] rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 animate-in fade-in duration-700 shadow-xl">
      {/* Left Sidebar: Filters — hidden on mobile */}
      <aside className="hidden md:flex w-56 bg-slate-50 dark:bg-white/[0.02] border-r border-slate-200 dark:border-white/5 flex-col p-6 space-y-8">
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
            <input type="text" placeholder="Search..." className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-1.5 pl-9 pr-3 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc]/50 transition-all" />
          </div>
          <nav className="space-y-1">
            {[
              { label: 'Inbox', icon: '📥', badge: 35, active: true },
              { label: 'Starred', icon: '⭐' },
              { label: 'Sent', icon: '📤' },
              { label: 'Drafts', icon: '📝', badge: 2 },
              { label: 'Scheduled', icon: '📅' },
              { label: 'Trash', icon: '🗑️' },
            ].map((item) => (
              <button key={item.label} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${item.active ? 'bg-[#0047cc]/10 text-[#0047cc] dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-300'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-sm grayscale opacity-60">{item.icon}</span>
                  {item.label}
                </div>
                {item.badge && <span className="bg-[#0047cc] text-white text-[9px] px-1.5 py-0.5 rounded-md">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/5">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4 px-3">Memo System</p>
          <div className="space-y-1">
            {['Dashboard', 'People', 'Time & Attendance', 'Leave Management', 'Payroll', 'Performance'].map((nav) => (
              <button key={nav} className="w-full text-left px-3 py-2 text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-tight">{nav}</button>
            ))}
          </div>
        </div>
      </aside>

      {/* Middle Pane: Memo List — full width on mobile, fixed width on desktop */}
      <aside className="w-full sm:w-[320px] border-r border-slate-200 dark:border-white/5 flex flex-col p-4 sm:p-6 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="flex items-center gap-2 mb-6">
          <button className="flex-1 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 transition-all">
            + New Memo
          </button>
          <button className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400">•••</button>
        </div>

        <div className="flex justify-between items-center mb-4 px-2">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Ongoing <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
          </p>
          <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01" strokeWidth="2"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {MEMO_LIST.map((memo) => (
            <button 
              key={memo.id} 
              onClick={() => setSelectedMemoId(memo.id)}
              className={`w-full text-left p-4 rounded-[20px] transition-all group border-2 ${selectedMemoId === memo.id ? 'bg-[#0047cc]/5 border-[#0047cc]/20' : 'hover:bg-white dark:hover:bg-white/[0.02] border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/10"><img src={memo.avatar} className="w-full h-full object-cover" alt="" /></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#0f172a] rounded-full" />
                  </div>
                  <div>
                    <p className={`text-xs font-black tracking-tight ${selectedMemoId === memo.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{memo.sender}</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{memo.time}</p>
                  </div>
                </div>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest truncate mb-1 ${selectedMemoId === memo.id ? 'text-[#0047cc]' : 'text-slate-500 dark:text-slate-400'}`}>{memo.subject}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 truncate">{memo.snippet}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content: Memo Detail */}
      <main className="hidden sm:flex flex-1 flex-col bg-white dark:bg-[#0f172a] relative">
        <div className="p-4 sm:p-8 border-b border-slate-200 dark:border-white/5 flex flex-wrap justify-between items-center gap-2">
          <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{selectedMemo.subject}</h3>
          <div className="flex gap-1 sm:gap-2">
            <button className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2.5"/></svg> Reply
            </button>
            <button className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2.5"/></svg> Reply All
            </button>
            <button className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white flex items-center gap-2">
              Forward <svg className="w-3.5 h-3.5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2.5"/></svg>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">•••</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10">
          {/* Memo Metadata */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img src={selectedMemo.senderAvatar} className="w-12 h-12 rounded-[18px] border-2 border-[#0047cc]/30" alt="" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{selectedMemo.senderName}</h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">{selectedMemo.senderRole}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">To: <span className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest">{selectedMemo.recipients}</span></p>
              </div>
            </div>
            <span className="text-xs font-black text-slate-400 dark:text-slate-600 tracking-widest uppercase">{selectedMemo.timestamp.slice(11, 16)}</span>
          </div>

          {/* Memo Body */}
          <div className="space-y-6 max-w-2xl">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedMemo.body}</p>
          
            <div className="pt-8">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Best regards,</p>
              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mt-1">{selectedMemo.senderName}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-600 font-bold uppercase tracking-tight">{selectedMemo.senderRole}</p>
            </div>
          </div>

          {/* Attachments */}
          {selectedMemo.attachments.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-white/5 max-w-2xl">
            {selectedMemo.attachments.map((att, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] flex items-center gap-4 group hover:border-[#0047cc]/30 transition-all">
               <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📄</div>
               <div className="flex-1">
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{att}</p>
               </div>
               <div className="flex gap-3">
                  <button className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-[#0047cc]">Download</button>
                  <button className="text-[10px] font-black text-[#0047cc] uppercase tracking-widest hover:underline">Open</button>
               </div>
            </div>
            ))}
          </div>
          )}


          <div className="flex gap-4 pt-12 border-t border-slate-200 dark:border-white/5 max-w-2xl">
             <button className="flex-1 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2"/></svg> Reply
             </button>
             <button className="flex-1 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2 transition-all">
                Forward <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" strokeWidth="2"/></svg>
             </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Contextual Chat */}
      <aside className="w-80 bg-slate-50/50 dark:bg-white/[0.01] border-l border-slate-200 dark:border-white/5 flex flex-col p-6 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">People <span className="text-slate-400 dark:text-slate-500 ml-1">(5)</span></h3>
            <button className="text-slate-400 dark:text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" strokeWidth="2"/></svg></button>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white dark:bg-white/5 rounded-[20px] border border-slate-200 dark:border-white/5 relative group cursor-pointer shadow-sm">
            <img src={selectedMemo.senderAvatar} className="w-8 h-8 rounded-xl border border-slate-200 dark:border-white/10" alt="" />
            <div className="flex-1">
              <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase">{selectedMemo.senderName}</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{selectedMemo.senderRole}</p>
            </div>
            <button className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white">⭐</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 border-t border-slate-200 dark:border-white/5 pt-6">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Chat</h3>
            <div className="flex gap-2">
               <button className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[8px] font-black uppercase text-slate-500 border border-slate-200 dark:border-white/10">Untread</button>
               <button className="px-2 py-0.5 bg-rose-500/10 rounded text-[8px] font-black uppercase text-rose-500 border border-rose-500/20">Delete</button>
               <button className="text-slate-400 dark:text-slate-600">▾</button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">Reople (2) ▾ <span className="ml-auto text-slate-300 dark:text-slate-700 text-base">+</span></p>
            <div className="space-y-6 overflow-y-auto pr-1">
              {CHAT_LOG.map((chat) => (
                <div key={chat.id} className="group animate-in slide-in-from-right-2 duration-300">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/5"><img src={chat.avatar} className="w-full h-full object-cover" alt="" /></div>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{chat.sender}</p>
                    </div>
                    <span className="text-[8px] text-slate-400 dark:text-slate-600 font-bold">{chat.time}</span>
                  </div>
                  <div className="pl-8 relative">
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-300 transition-colors">{chat.msg}</p>
                     {chat.id === 'c1' && <div className="absolute left-6 top-0 w-[1.5px] h-full bg-[#0047cc]/20" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-sm focus-within:border-[#0047cc]/50 transition-all">
              <input 
                type="text" 
                placeholder="Write a message..." 
                className="bg-transparent border-none text-[10px] text-slate-900 dark:text-white flex-1 outline-none font-medium placeholder-slate-400 dark:placeholder-slate-600 py-0.5"
              />
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 11v3m0-6h.01" strokeWidth="2"/></svg>
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
               <div className="flex gap-1.5">
                 <button className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2.5"/></svg></button>
               </div>
               <button className="text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg></button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MemoSystem;
