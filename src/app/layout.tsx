import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/lib/Providers';
import { SocketProvider } from '@/lib/socket';
import { CallProvider } from '@/lib/callContext';
import VideoCallModal from '@/components/chat/VideoCallModal';
import IncomingCallModal from '@/components/chat/IncomingCallModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Course Master - Learn Anything, Anywhere',
  description: 'A modern learning management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ReduxProvider>
          <SocketProvider>
            <CallProvider>
              {children}
              <VideoCallModal />
              <IncomingCallModal />
            </CallProvider>
          </SocketProvider>
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}

