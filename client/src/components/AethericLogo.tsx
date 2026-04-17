/**
 * Aetheric AI Logo — Premium Ethereal "A" with Orbital Ring
 * A minimalist, glowing letter A with an orbital aura ring and animated pulse.
 */
export default function AethericLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Gradient for the outer glow ring */}
        <linearGradient id="aether-ring" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
        </linearGradient>

        {/* Gradient for the "A" letter */}
        <linearGradient id="aether-text" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="aether-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Outer glow for ring */}
        <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle — subtle dark fill */}
      <circle cx="32" cy="32" r="28" fill="#0d0d0d" stroke="url(#aether-ring)" strokeWidth="1.5" opacity="0.6" />

      {/* Orbital ring — tilted ellipse */}
      <ellipse
        cx="32" cy="32" rx="26" ry="10"
        fill="none"
        stroke="url(#aether-ring)"
        strokeWidth="1.2"
        opacity="0.5"
        transform="rotate(-20, 32, 32)"
        filter="url(#ring-glow)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="-20 32 32"
          to="340 32 32"
          dur="12s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* Second orbital ring — opposite tilt */}
      <ellipse
        cx="32" cy="32" rx="24" ry="8"
        fill="none"
        stroke="url(#aether-ring)"
        strokeWidth="0.8"
        opacity="0.3"
        transform="rotate(40, 32, 32)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="40 32 32"
          to="-320 32 32"
          dur="18s"
          repeatCount="indefinite"
        />
      </ellipse>

      {/* The "A" symbol — clean geometric */}
      <g filter="url(#aether-glow)">
        <path
          d="M32 16 L21 48 L25.5 48 L28 41 L36 41 L38.5 48 L43 48 Z M29.5 37 L32 22 L34.5 37 Z"
          fill="url(#aether-text)"
          fillRule="evenodd"
        />
      </g>

      {/* Small orbiting dot — accent */}
      <circle r="1.8" fill="#a78bfa" opacity="0.9" filter="url(#ring-glow)">
        <animateMotion
          dur="6s"
          repeatCount="indefinite"
          path="M32,22 A26,10 -20 1,1 32,21.99 Z"
        />
      </circle>
    </svg>
  );
}
