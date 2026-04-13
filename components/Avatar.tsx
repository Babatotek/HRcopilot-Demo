import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: number;        // px, default 36
  radius?: string;      // tailwind class, default 'rounded-full'
  className?: string;
}

/** Deterministic color from name */
const nameToColor = (name: string): string => {
  const palette = [
    '#0047cc', '#0035a0', '#0ea5e9', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#06b6d4',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};

const initials = (name: string) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 36,
  radius = 'rounded-full',
  className = '',
}) => {
  const [failed, setFailed] = useState(false);
  const color = nameToColor(name);
  const fontSize = Math.max(10, Math.round(size * 0.36));

  const base = `flex-shrink-0 overflow-hidden border border-slate-200 dark:border-white/10 ${radius} ${className}`;

  if (!src || failed) {
    return (
      <div
        className={`${base} flex items-center justify-center font-black text-white select-none`}
        style={{ width: size, height: size, backgroundColor: color, fontSize }}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    <div className={base} style={{ width: size, height: size, minWidth: size }}>
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Avatar;
