import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Universal Survival Phrasebook',
  description: 'Anonymous local-first survival phrase learning app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1>Universal Survival Phrasebook</h1>
          <div className="nav">
            <Link href="/learn">Learn</Link>
            <Link href="/review">Review</Link>
            <Link href="/settings">Settings</Link>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
