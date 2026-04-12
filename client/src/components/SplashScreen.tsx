import { useState, useEffect, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasEnded = useRef(false);

  const triggerFadeOut = () => {
    if (hasEnded.current) return;
    hasEnded.current = true;
    setFadeOut(true);
    // Wait for fade animation to finish, then call onComplete
    setTimeout(() => onComplete(), 800);
  };

  useEffect(() => {
    // Fallback: if video doesn't end or takes too long, auto-dismiss after 4s
    const timeout = setTimeout(() => triggerFadeOut(), 4000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Try to play video (some browsers block autoplay)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay blocked, just skip after timeout
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ease-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ overflow: 'hidden' }}
    >
      <video
        ref={videoRef}
        src="/splash.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        muted
        autoPlay
        playsInline
        onEnded={triggerFadeOut}
      />
      {/* Optional: subtle vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
