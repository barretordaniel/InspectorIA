export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 40 : 32
  const textClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-xl bg-[#0f2356] flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg width={iconSize * 0.65} height={iconSize * 0.65} viewBox="0 0 20 20" fill="none">
          <path d="M3 17 L10 4 L17 17" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 12 L13.5 12" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M8 9 L12 9" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="10" cy="17" r="1.5" fill="#3b82f6"/>
        </svg>
      </div>
      <span className={`font-semibold tracking-tight ${textClass} font-display`}>
        <span className="text-[#0f2356]">Inspector</span>
        <span className="text-[#1d6fff]">IA</span>
      </span>
    </div>
  )
}
