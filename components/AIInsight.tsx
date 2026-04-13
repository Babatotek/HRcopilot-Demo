
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface AIInsightProps {
  content?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const AIInsight: React.FC<AIInsightProps> = ({ content, isLoading, onRefresh, className = '' }) => {
  return (
    <div className={`p-5 rounded-[24px] bg-gradient-to-br from-[#0047cc]/10 to-transparent border border-[#0047cc]/20 relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0047cc]/20 flex items-center justify-center text-lg animate-pulse">✨</div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Strategic Analyst</span>
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-30"
            disabled={isLoading}
          >
            <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-white/5 rounded-full w-[90%] animate-pulse" />
          <div className="h-3 bg-white/5 rounded-full w-[60%] animate-pulse" />
        </div>
      ) : (
        <div className="text-slate-300 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-1 duration-500 prose prose-invert prose-xs max-w-none">
          <ReactMarkdown>
            {content || 'Awaiting fresh data parameters for strategic evaluation...'}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIInsight;
