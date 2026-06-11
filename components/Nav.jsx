'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const LINKS = [
  ['/', 'Home'],
  ['/quiz', 'Find my gap'],
  ['/courses', 'Courses'],
  ['/news', 'Trends & news'],
  ['/resume', 'Resume check'],
  ['/consultancy', 'Salary paths'],
  ['/log', 'My journey'],
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/50 border-b border-line/50">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="font-display font-bold text-[15px] sm:text-base shrink-0 flex items-center gap-2">
          <span className="text-brand"><Icon name="bee" size={22} strokeWidth={1.6} /></span>
          <span><span className="liquid-logo">Sindhu&apos;s</span> AI Career Guidance</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-[13px] sm:text-sm overflow-x-auto thin-scroll">
          {LINKS.map(([href, label]) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${active ? 'bg-brand/20 text-white' : 'text-mut hover:text-white hover:bg-card'}`}>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
