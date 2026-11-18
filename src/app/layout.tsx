import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nookly - A Smarter Way to Organize and Share Learning Resources',
  description: 'Built for UNESA Data Science students. Structured by course & chapter, vetted by admins, tracked for learning gaps.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-screen bg-[#FAFAFA] text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
