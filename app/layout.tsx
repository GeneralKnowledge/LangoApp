import './globals.css';
import AppShellHeader from '@/components/AppShellHeader';

export const metadata = {
  title: 'Universal Survival Phrasebook',
  description: 'Anonymous local-first survival phrase learning app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <AppShellHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
