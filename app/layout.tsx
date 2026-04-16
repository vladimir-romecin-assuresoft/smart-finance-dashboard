import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Finance Dashboard',
  description: 'Personal finance management with AI-powered insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Background decorative orbs */}
        <div className="bg-orb w-[600px] h-[600px] bg-violet-600 top-[-200px] left-[-200px]" />
        <div className="bg-orb w-[500px] h-[500px] bg-blue-600 bottom-[-150px] right-[-150px]" />
        <div className="bg-orb w-[300px] h-[300px] bg-emerald-600 top-[40%] left-[60%]" />
        {children}
      </body>
    </html>
  );
}
