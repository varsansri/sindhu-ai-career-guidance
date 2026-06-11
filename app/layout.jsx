import './globals.css';
import Nav from '@/components/Nav';
import { CopilotProvider } from '@/components/CopilotContext';
import Copilot from '@/components/Copilot';
import ShaderBg from '@/components/ShaderBg';

export const metadata = {
  title: "Sindhu's AI Career Guidance",
  description: 'Trend-based career guidance for college-out students — the skills you need to earn the salary you expect.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ShaderBg />
        <CopilotProvider>
          {/* reserve right rail space on desktop so nav + content share one left edge */}
          <div className="lg:pr-[340px]">
            <Nav />
            <main className="min-h-screen">{children}</main>
            <footer className="border-t border-line/50 mt-16 py-8 text-center text-mut text-sm">
              © 2026 Sindhu&apos;s AI Career Guidance · Trend-based guidance for fresh graduates.
            </footer>
          </div>
          <Copilot />
        </CopilotProvider>
      </body>
    </html>
  );
}
