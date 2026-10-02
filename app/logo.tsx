// GatorResource mark: a location pin whose center is a gator's eye (slit pupil),
// meaning "find the right place".
export function LogoMark({ size = 36 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 38S5.5 25.5 5.5 15.5a14.5 14.5 0 0 1 29 0C34.5 25.5 20 38 20 38z" fill="#294e3b" />
    <circle cx="20" cy="15.5" r="8" fill="#ddecac" />
    <ellipse cx="20" cy="15.5" rx="2.2" ry="5.6" fill="#294e3b" />
  </svg>;
}
export function Logo({ size = 36 }: { size?: number }) {
  return <span className="logo"><LogoMark size={size} /><span className="wordmark">Gator<b>Resource</b></span></span>;
}
