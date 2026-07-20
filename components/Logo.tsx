export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.4 : 1;
  const w = Math.round(44 * scale);
  const h = Math.round(44 * scale);

  return (
    <svg width={w} height={h} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      {/* Halo */}
      <ellipse cx="22" cy="24" rx="20" ry="17" fill="#fce4ec" opacity="0.5"/>

      {/* Coeur gauche */}
      <path d="M3,16 C3,9 8,6 11,9 C12,6 15,5 17,9 C17,5 20,6 21,9 C24,6 29,9 29,16 C29,23 17,32 17,32 C17,32 3,23 3,16Z"
            fill="#e8697a"/>

      {/* Coeur droit */}
      <path d="M15,16 C15,9 20,6 23,9 C24,6 27,5 29,9 C29,5 32,6 33,9 C36,6 41,9 41,16 C41,23 29,32 29,32 C29,32 15,23 15,16Z"
            fill="#c0335a" opacity="0.88"/>

      {/* Cookie dans coeur gauche */}
      <circle cx="13" cy="19" r="7" fill="#e8976a"/>
      <circle cx="10" cy="16" r="1.8" fill="#6b3a1f"/>
      <circle cx="15" cy="21" r="1.5" fill="#6b3a1f"/>
      <circle cx="12" cy="22" r="1.4" fill="#6b3a1f"/>
      <circle cx="16" cy="16" r="1.2" fill="#6b3a1f"/>

      {/* Gateau dans coeur droit */}
      <rect x="24" y="20" width="10" height="6" rx="1.5" fill="#f8bbd0"/>
      <path d="M24,20 Q27,15 29,17 Q31,14 34,20Z" fill="white"/>
      <circle cx="29" cy="14" r="2" fill="#e8697a"/>
      <line x1="29" y1="12" x2="30" y2="10" stroke="#5a8a3a" strokeWidth="1" strokeLinecap="round"/>
      <rect x="26" y="16" width="1.5" height="4" rx="0.5" fill="#ffd700"/>
      <rect x="31" y="16" width="1.5" height="4" rx="0.5" fill="#ffd700"/>

      {/* Fouet */}
      <line x1="21" y1="28" x2="21" y2="35" stroke="#c0335a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21,28 Q17,22 19,18" stroke="#7a2050" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M21,28 Q21,21 21,18" stroke="#7a2050" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M21,28 Q25,22 23,18" stroke="#7a2050" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <ellipse cx="21" cy="17.5" rx="3" ry="2" fill="none" stroke="#7a2050" strokeWidth="1"/>

      {/* Etoiles */}
      <text x="0" y="10" fontSize="5" fill="#ffd700">✦</text>
      <text x="37" y="10" fontSize="4" fill="#ffd700">✦</text>
      <text x="19" y="5" fontSize="4" fill="#ffd700">✦</text>
    </svg>
  );
}
