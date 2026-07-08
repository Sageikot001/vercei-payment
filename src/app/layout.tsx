import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/styles/registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VerceI - Modern Web Hosting',
  description: 'Simple, transparent hosting plans for your web projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0 }}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
