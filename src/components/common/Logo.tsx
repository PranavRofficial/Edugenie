import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-xl',
  };

  const titleSizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Brand Icon: Graduation Cap + AI Spark Concept */}
      <div
        className={`${iconSizeClasses[size]} relative rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 p-0.5 shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center`}
      >
        <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-indigo-700/80 to-indigo-950 flex items-center justify-center relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-400/40 rounded-full blur-md" />

          {/* SVG combining Graduation Cap + AI Sparkle */}
          <svg
            className="w-3/5 h-3/5 text-white drop-shadow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Cap */}
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            {/* Sparkle star */}
            <circle cx="12" cy="10" r="1.5" fill="#38bdf8" stroke="none" />
            <path
              d="M19 4v2m-1-1h2"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${titleSizeClasses[size]} tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent`}
          >
            EDUGENIE
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
            Learn Smarter. Learn Faster.
          </span>
        )}
      </div>
    </div>
  );
};
