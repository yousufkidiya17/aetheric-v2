/**
 * Aetheric AI Logo — Dotted Sphere
 * A 3D sphere made of white dots, larger in center, smaller at edges
 */
export default function AethericLogo({ className = "w-8 h-8" }: { className?: string }) {
  // Generate dots in a grid, size based on distance from center to create sphere illusion
  const dots: { cx: number; cy: number; r: number }[] = [];
  const cols = 11;
  const rows = 11;
  const centerX = 32;
  const centerY = 32;
  const spacing = 5;
  const maxRadius = 26;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = centerX + (col - (cols - 1) / 2) * spacing;
      const y = centerY + (row - (rows - 1) / 2) * spacing;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= maxRadius) {
        // Dots are larger near center, smaller at edges (sphere projection)
        const normalizedDist = dist / maxRadius;
        const sphereFactor = Math.sqrt(1 - normalizedDist * normalizedDist);
        const dotSize = 0.4 + sphereFactor * 2.2;
        const opacity = 0.15 + sphereFactor * 0.85;
        dots.push({ cx: x, cy: y, r: Math.max(0.3, dotSize) });
      }
    }
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {dots.map((dot, i) => {
        const dx = dot.cx - centerX;
        const dy = dot.cy - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const normalizedDist = dist / maxRadius;
        const opacity = 0.2 + (1 - normalizedDist) * 0.8;
        return (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="white"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
