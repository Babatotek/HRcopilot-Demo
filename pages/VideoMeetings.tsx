
import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';

const PARTICIPANTS = [
  { id: 'p1', name: 'Kelly Robinson', role: 'Marketing Manager', avatar: 'https://picsum.photos/400/400?sig=v1', active: true, speaking: true },
  { id: 'p2', name: 'Tom Green', role: 'Support Engineer', avatar: 'https://picsum.photos/400/400?sig=v2' },
  { id: 'p3', name: 'Emily Johnson', role: 'HR Admin', avatar: 'https://picsum.photos/400/400?sig=v3', isSelf: true },
  { id: 'p4', name: 'Robert Davis', role: 'Software Engineer', avatar: 'https://picsum.photos/400/400?sig=v4' },
  { id: 'p5', name: 'John Smith', role: 'Sales Associate', avatar: 'https://picsum.photos/400/400?sig=v5' },
  { id: 'p6', name: 'Amanda Ward', role: 'HR Specialist', avatar: 'https://picsum.photos/400/400?sig=v6' },
];

const CHAT_MESSAGES = [
  { id: 'm1', sender: 'Emily Johnson', msg: 'Let\'s review the Q1 reports, discuss the hiring pipeline, and plan for next Monday\'s product launch event.', time: '2:01 PM', type: 'text', icon: '📌' },
  { id: 'm2', sender: 'Robert Davis', msg: 'Hi all, is the new hire set to start next Tuesday?', time: '2:03 PM', type: 'text' },
  { id: 'm3', sender: 'Tom Green', msg: 'Yes, looking forward to hiring the support team. I\'ll start the onboarding activities after the meetings.', time: '2:04 PM', type: 'text' },
  { id: 'm4', sender: 'Kelly Robinson', msg: 'In the next few days, look for the product launch. Feedback is welcome!', time: '2:14 PM', type: 'text' },
  { id: 'm5', sender: 'Robert Davis', file: 'Q1_Report_Review.pptx', size: '1.5 MB', time: '2:15 PM', type: 'file' },
  { id: 'm6', sender: 'Tom Green', msg: 'Just finished updating the updated slides now.', time: '2:16 PM', type: 'text' },
];

const VideoMeetings: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-[#0b0e14] rounded-[32px] overflow-hidden border border-white/5 animate-in zoom-in-95 duration-700">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#14181f]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#323741] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#3d434f] transition-all">
            <span className="text-sm">+</span> Start Meeting
          </button>
          <button className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>
          </button>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-black text-white tracking-tight">HR Weekly Sync Call <span className="ml-3 text-slate-500 font-mono text-sm">39:01</span></h2>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2"/></svg>
           </div>
           <button className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" strokeWidth="2"/></svg>
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Stage */}
        <div className="flex-1 p-6 flex flex-col gap-6 relative">
          <div className="grid grid-cols-2 grid-rows-3 gap-4 flex-1">
             {PARTICIPANTS.map((p) => (
               <div key={p.id} className={`relative rounded-[24px] overflow-hidden group border-2 ${p.isSelf ? 'border-amber-400/40' : 'border-transparent'}`}>
                  <img src={p.avatar} className="w-full h-full object-cover" alt={p.name} />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <p className="text-sm font-black text-white">{p.name}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.role}</p>
                  </div>
                  {p.speaking && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse" />
                  )}
               </div>
             ))}
          </div>

          {/* Active Speaker Prompt */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/5">
             <span className="text-[10px]">✨</span>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">Kelly Robinson is talking</p>
          </div>

          {/* Bottom Thumbnails & Controls */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-center gap-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-24 h-16 rounded-xl border border-white/10 overflow-hidden relative ${i === 3 ? 'border-amber-400 shadow-[0_0_10px_#fbbf2440]' : ''}`}>
                     <img src={`https://picsum.photos/100/100?sig=thumb${i}`} className="w-full h-full object-cover opacity-60" />
                     <span className="absolute bottom-1 right-1 text-[8px] font-black text-white bg-black/40 px-1 rounded uppercase">SM</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 ml-4">
                   <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">SM</button>
                   <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785 4.53 4.53 0 0 0 3.033-1.583c.289-.286.677-.423 1.057-.423.41 0 .82.164 1.134.423a8.953 8.953 0 0 0 1.84 1.152Z" strokeWidth="2"/></svg>
                   </button>
                   <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">•••</button>
                </div>
             </div>

             <div className="flex justify-between items-center bg-[#14181f]/90 backdrop-blur-xl border border-white/10 p-3 rounded-[24px]">
                <div className="flex gap-2">
                   {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/40/40?sig=c${i}`} className="w-8 h-8 rounded-full border border-[#0f172a]" />)}
                   <button className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2"/></svg>
                   </button>
                </div>

                <div className="flex gap-3">
                   <button onClick={() => setIsMicOn(!isMicOn)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/5 text-slate-400' : 'bg-rose-500 text-white'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" strokeWidth="2"/></svg>
                   </button>
                   <button onClick={() => setIsCamOn(!isCamOn)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCamOn ? 'bg-white/5 text-slate-400' : 'bg-rose-500 text-white'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" strokeWidth="2"/></svg>
                   </button>
                   <button className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" strokeWidth="2"/></svg>
                   </button>
                   <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785 4.53 4.53 0 0 0 3.033-1.583c.289-.286.677-.423 1.057-.423.41 0 .82.164 1.134.423a8.953 8.953 0 0 0 1.84 1.152Z" strokeWidth="2"/></svg>
                   </button>
                   <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" strokeWidth="2"/></svg>
                   </button>
                   <button className="w-12 h-12 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7.5 8.25h9m-9 3h9m-9 3h3m-6.75 4.125a3 3 0 003 3h7.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-7.5a3 3 0 00-3 3v13.125Z" strokeWidth="2"/></svg>
                   </button>
                </div>

                <button className="px-8 py-3 bg-rose-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-95 transition-all">
                  Leave
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-[360px] bg-[#14181f] border-l border-white/5 flex flex-col p-6 space-y-6">
           {/* People List */}
           <div>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">People <span className="text-slate-500 ml-1">(5)</span></h3>
                 <button className="text-slate-500 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeWidth="2"/></svg>
                 </button>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <div className="relative">
                          <img src="https://picsum.photos/40/40?sig=me" className="w-9 h-9 rounded-xl border border-[#0047cc]" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#14181f] rounded-full" />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white leading-tight">Emily Johnson</p>
                          <p className="text-[8px] text-slate-500 font-bold uppercase">HH Admin</p>
                       </div>
                    </div>
                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">💼</span>
                 </div>
              </div>
           </div>

           {/* Chat Panel */}
           <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-4 border-t border-white/5 pt-6">
                 <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Chat</h3>
                 <button className="text-slate-500">•••</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                 {CHAT_MESSAGES.map((m) => (
                   <div key={m.id} className="space-y-1.5 animate-in slide-in-from-right-2 duration-300">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <img src={`https://picsum.photos/24/24?sig=${m.sender}`} className="w-5 h-5 rounded-full" />
                            <span className="text-[10px] font-black text-white uppercase">{m.sender}</span>
                         </div>
                         <span className="text-[8px] text-slate-500 font-bold">{m.time}</span>
                      </div>
                      <div className="pl-7">
                         {m.type === 'text' ? (
                            <div className="relative">
                               {m.icon && <span className="absolute -left-6 top-1 text-xs">{m.icon}</span>}
                               <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{m.msg}</p>
                            </div>
                         ) : (
                            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
                               <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center text-xs">📄</div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold text-white truncate">{m.file}</p>
                                  <p className="text-[8px] text-slate-500 font-bold uppercase">{m.size}</p>
                               </div>
                               <button className="text-[8px] font-black text-blue-400 uppercase hover:underline">Download</button>
                            </div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>

              {/* Chat Input */}
              <div className="mt-6 space-y-4">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3 focus-within:border-[#0047cc]/50 transition-all">
                    <input 
                      type="text" 
                      placeholder="Write a message..." 
                      className="bg-transparent border-none text-[11px] text-white flex-1 outline-none py-1 placeholder-slate-600"
                    />
                    <div className="flex items-center gap-2">
                       <button className="text-slate-500 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                       </button>
                       <button className="text-slate-500 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 11v3m0-6h.01" strokeWidth="2"/></svg>
                       </button>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/24/24?sig=tiny${i}`} className="w-6 h-6 rounded-full border border-white/10" />)}
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[8px] font-black text-slate-500">Alo</div>
                    <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[8px] font-black text-slate-500">Jvy</div>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default VideoMeetings;
