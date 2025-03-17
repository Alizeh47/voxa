import './globals.css';
import { Inter } from 'next/font/google';
import { Tomorrow } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

const tomorrow = Tomorrow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-tomorrow',
});

export const metadata = {
  title: 'Voxa',
  description: 'Your AI-powered creative companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={tomorrow.variable}>
      <body className={inter.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
