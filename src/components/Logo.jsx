/**
 * The Depot mark: a red dot resting on a plinth, a piece on display.
 * The plinth uses currentColor, so the logo works on light and dark grounds.
 */
export function LogoMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 30" aria-hidden="true" focusable="false">
      <circle cx="12" cy="6.5" r="5.5" fill="var(--dot, #c4262e)" />
      <path d="M3 15h18v15H3z" fill="currentColor" />
      <path d="M3 15h18v2.2H3z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <LogoMark className="logo-mark" />
      <span className="logo-word">Depot</span>
    </span>
  );
}
