import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Study',
  description: 'Social media study',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{ children }</body>
    </html>
  );
}
