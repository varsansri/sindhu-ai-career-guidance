// Custom line-icon set (no emojis). All stroke="currentColor", 24x24, inherit color/size.
const P = {
  // course subjects
  code: <><path d="M9 8 5 12l4 4" /><path d="M15 8l4 4-4 4" /><path d="M13 5l-2 14" /></>,
  data: <><path d="M4 19V10" /><path d="M9 19V5" /><path d="M14 19v-7" /><path d="M19 19V8" /></>,
  web: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.3 4 5.3 4 8.5s-1.4 6.2-4 8.5c-2.6-2.3-4-5.3-4-8.5s1.4-6.2 4-8.5Z" /></>,
  cloud: <><path d="M7 18h9.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.2A3.8 3.8 0 0 0 7 18Z" /></>,
  // ui / meaning
  trend: <><path d="M4 15l5-5 3 3 6-7" /><path d="M15 6h3v3" /></>,
  flame: <><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.6.6-2.4 1.3-3.2C10 9 11.5 8 12 3Z" /></>,
  bulb: <><path d="M9 18h6" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  link: <><path d="M9.5 14.5l5-5" /><path d="M8 11 6 13a3.2 3.2 0 0 0 4.5 4.5l1.5-1.5" /><path d="M16 13l2-2A3.2 3.2 0 0 0 13.5 6.5L12 8" /></>,
  trophy: <><path d="M8 5h8v4a4 4 0 0 1-8 0V5Z" /><path d="M8 6H5v1a3 3 0 0 0 3 3" /><path d="M16 6h3v1a3 3 0 0 1-3 3" /><path d="M10 14v3h4v-3" /><path d="M8 20h8" /></>,
  upload: <><path d="M12 16V5" /><path d="M8 9l4-4 4 4" /><path d="M5 19h14" /></>,
  bolt: <path d="M13 3 5 13h5l-1 8 8-11h-5l1-7Z" />,
  puzzle: <path d="M10 4h4v2.5a1.5 1.5 0 0 0 3 0V4h0a0 0 0 0 1 0 0v4h2.5a1.5 1.5 0 0 1 0 3H17v4h-2.5a1.5 1.5 0 0 0-3 0V20H8v-4H5.5a1.5 1.5 0 0 1 0-3H8V8h2V4Z" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" /></>,
  rupee: <><path d="M8 6h8" /><path d="M8 10h8" /><path d="M8 6c4 0 5 4 1 4H8l6 8" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  send: <><path d="M5 12h13" /><path d="M12 5l7 7-7 7" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  doc: <><path d="M7 3h7l4 4v14H7Z" /><path d="M14 3v4h4" /><path d="M9.5 12h5" /><path d="M9.5 15.5h5" /></>,
  briefcase: <><rect x="4" y="7.5" width="16" height="11" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" /><path d="M4 12h16" /></>,
  wrench: <path d="M15 5a4 4 0 0 0-5 5L5 15l4 4 5-5a4 4 0 0 0 5-5l-2.5 2.5L14 9l1.5-2.5L15 5Z" />,
  star: <path d="M12 4l2.3 4.7 5.2.8-3.7 3.6.9 5.1L12 16.8 7.3 18.2l.9-5.1L4.5 9.5l5.2-.8L12 4Z" />,
  route: <><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path d="M8 18h6a3 3 0 0 0 0-6H10a3 3 0 0 1 0-6h6" /></>,
  spark: <><path d="M12 3v4" /><path d="M12 17v4" /><path d="M3 12h4" /><path d="M17 12h4" /><path d="M6 6l2.5 2.5" /><path d="M15.5 15.5 18 18" /><path d="M18 6l-2.5 2.5" /><path d="M8.5 15.5 6 18" /></>,
  // brand / copilot mark — hexagon "bee"
  bee: <><path d="M12 3.2l7 4v7.6l-7 4-7-4V7.2l7-4Z" /><path d="M9 11h6" /><path d="M9 14h6" /><path d="M12 8.2v8.6" /></>,
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.7 }) {
  const body = P[name];
  if (!body) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden>
      {body}
    </svg>
  );
}
