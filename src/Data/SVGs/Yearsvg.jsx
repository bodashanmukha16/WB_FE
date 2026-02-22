export const Year1SVG = () => (
<svg viewBox="0 0 300 300" className="w-40 h-40">
  <defs>
    <linearGradient id="y1g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4F46E5"/>
      <stop offset="100%" stopColor="#9333EA"/>
    </linearGradient>
  </defs>

  <ellipse cx="150" cy="230" rx="70" ry="15" fill="#000" opacity="0.1"/>

  <rect x="90" y="140" width="120" height="30" rx="8" fill="url(#y1g1)"/>
  <rect x="100" y="115" width="100" height="30" rx="8" fill="#6366F1"/>
  <rect x="110" y="90" width="80" height="30" rx="8" fill="#8B5CF6"/>

  <circle cx="150" cy="60" r="20" fill="#FACC15"/>
</svg>
)

export const Year2SVG = () => (
<svg viewBox="0 0 300 300" className="w-40 h-40">
  <defs>
    <linearGradient id="y2g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#10B981"/>
      <stop offset="100%" stopColor="#06B6D4"/>
    </linearGradient>
  </defs>

  <ellipse cx="150" cy="230" rx="70" ry="15" fill="#000" opacity="0.1"/>

  <rect x="80" y="100" width="140" height="80" rx="12" fill="url(#y2g1)"/>
  <rect x="70" y="180" width="160" height="20" rx="6" fill="#0F172A"/>

  <text x="110" y="150" fill="white" fontSize="30">&lt;/&gt;</text>
</svg>
)

export const Year3SVG = () => (
<svg viewBox="0 0 300 300" className="w-40 h-40">
  <defs>
    <linearGradient id="y3g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#F97316"/>
      <stop offset="100%" stopColor="#EF4444"/>
    </linearGradient>
  </defs>

  <ellipse cx="150" cy="230" rx="70" ry="15" fill="#000" opacity="0.1"/>

  <rect x="100" y="120" width="25" height="60" fill="url(#y3g1)"/>
  <rect x="140" y="100" width="25" height="80" fill="#FB923C"/>
  <rect x="180" y="140" width="25" height="40" fill="#F87171"/>

  <circle cx="150" cy="70" r="20" fill="#FCD34D"/>
</svg>
)

export const Year4SVG = () => (
<svg viewBox="0 0 300 300" className="w-40 h-40">
  <defs>
    <linearGradient id="y4g1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#6366F1"/>
      <stop offset="100%" stopColor="#EC4899"/>
    </linearGradient>
  </defs>

  <ellipse cx="150" cy="230" rx="70" ry="15" fill="#000" opacity="0.1"/>

  <polygon points="80,120 150,90 220,120 150,150" fill="url(#y4g1)"/>
  <rect x="130" y="150" width="40" height="20" fill="#1E293B"/>
  <line x1="150" y1="120" x2="150" y2="170" stroke="#FACC15" strokeWidth="4"/>
  <circle cx="150" cy="175" r="6" fill="#FACC15"/>
</svg>
)