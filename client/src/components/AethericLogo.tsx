/**
 * Aetheric AI Logo — SVG inline component
 * A geometric "A" mark with a purple-accent gradient, matching the "Luminous Void" design system
 */
export default function AethericLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="aetheric-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C4DFF" />
          <stop offset="50%" stopColor="#a498bb" />
          <stop offset="100%" stopColor="#ff84aa" />
        </linearGradient>
        <linearGradient id="aetheric-inner" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="url(#aetheric-grad)" strokeWidth="2" fill="none" opacity="0.5" />
      {/* Inner fill */}
      <circle cx="32" cy="32" r="26" fill="url(#aetheric-inner)" />
      {/* The "A" letterform */}
      <path
        d="M32 14L44 50H38.5L35.5 41H28.5L25.5 50H20L32 14Z"
        fill="url(#aetheric-grad)"
      />
      {/* Crossbar of A */}
      <rect x="27" y="35" width="10" height="2" rx="1" fill="#0e0e0e" opacity="0.8" />
      {/* Top accent dot */}
      <circle cx="32" cy="12" r="1.5" fill="#7C4DFF" opacity="0.8" />
    </svg>
  );
}
