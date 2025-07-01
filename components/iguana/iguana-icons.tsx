export function IguanaIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2C8 2 5 5 5 9c0 2 1 4 2 5l-2 3c0 1 1 2 2 2h10c1 0 2-1 2-2l-2-3c1-1 2-3 2-5 0-4-3-7-7-7z"
        fill="currentColor"
        opacity="0.8"
      />
      <path d="M8 8c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm6 0c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z" fill="#FFD700" />
      <path d="M6 6l1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2 1-2 1 2" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function LeafIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2C8 2 5 5 5 9c0 5 3 8 7 8s7-3 7-8c0-4-3-7-7-7z" fill="url(#leafGradient)" />
      <path d="M12 3v16" stroke="#16A34A" strokeWidth="1" />
      <path d="M12 6c-2 2-4 4-4 6s2 4 4 4" stroke="#16A34A" strokeWidth="0.5" fill="none" />
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
    </svg>
  )
}
