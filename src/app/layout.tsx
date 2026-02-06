import './globals.css';
import type { Metadata } from 'next';

import { AppHeader } from '@/components/app-shell/header';
import { Toaster } from '@/components/ui/sonner';

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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
