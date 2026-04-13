import React, { useState } from 'react';
import GlassCard from '../GlassCard';

const DynamicForm: React.FC = () => {
  const [fileText, setFileText] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileText) return;
    
    setIsExtracting(true);
    // Simulate AI extraction
    setTimeout(() => {
      setExtractedData({
        documentType: 'Invoice',
        amount: '$4,500.00',
        date: '2023-10-15',
        vendor: 'TechCorp Solutions',
        confidence: '98%'
      });
      setIsExtracting(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <GlassCard className="p-6">
        <h3 className="text-xs font-black uppercase tracking-widest mb-4">Document Intake</h3>
        <p className="text-[10px] text-slate-500 mb-6">Paste raw document text to auto-extract amounts, dates, and entities.</p>
        
        <form onSubmit={handleExtract} className="space-y-4">
          <textarea 
            value={fileText}
            onChange={(e) => setFileText(e.target.value)}
            className="w-full h-64 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-xs focus:outline-none"
            placeholder="Paste raw text from invoice, contract, or receipt here..."
          />
          <button 
            type="submit"
            disabled={isExtracting || !fileText}
            className="w-full py-3 bg-[var(--brand-primary)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isExtracting ? 'Extracting Data...' : 'Auto-Extract Entities'}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-xs font-black uppercase tracking-widest mb-4">Extracted Metadata</h3>
        
        {extractedData ? (
          <div className="space-y-4">
            {Object.entries(extractedData).map(([key, value]) => (
              <div key={key} className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{value as string}</p>
              </div>
            ))}
            <div className="pt-4 flex gap-2">
              <button className="flex-1 py-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-xl text-[9px] font-black uppercase tracking-widest">Edit</button>
              <button className="flex-1 py-2 bg-[var(--brand-primary)] text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Save to Cabinet</button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-12">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Extraction</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default DynamicForm;
