import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lightning SimulWhispe - Real-Time Speech Translator',
  description: 'Real-time speech translation powered by Gemini AI and Web Speech API',
  keywords: 'speech translation, real-time translation, voice translator, Gemini AI',
  authors: [{ name: 'Lightning SimulWhispe' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
