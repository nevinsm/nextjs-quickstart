import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Base',
  description: 'Hackathon starter template',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
