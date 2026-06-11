import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: "Sindhu's AI Career Guidance",
  description: 'Trend-based career guidance for college-out students — the skills you need to earn the salary you expect.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-line/60 mt-16 py-8 text-center text-mut text-sm">
          © 2026 Sindhu&apos;s AI Career Guidance · Trend-based guidance for fresh graduates.
        </footer>
      </body>
    </html>
  );
}
