import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth/session-provider";
import { AppHeader } from "@/components/app/app-header";

export const metadata: Metadata = {
  title: {
    default: 'Maridaje Pro | Tu Sommelier Personal',
    template: '%s | Maridaje Pro'
  },
  description: 'Encuentra el maridaje de vino perfecto para cualquier plato. Conecta tu bodega personal y recibe recomendaciones adecuadas al instante.',
  keywords: ['maridaje de vino', 'sommelier ia', 'vinos y comidas', 'bodega personal', 'gemini ai', 'recomendación de vinos'],
  authors: [{ name: 'Claudio Ceppi' }],
  creator: 'Claudio Ceppi',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://maridajepro.com', // Ajustar según despliegue real
    title: 'Maridaje Pro | Tu Sommelier Personal',
    description: 'Encuentra el maridaje de vino perfecto para cualquier plato.',
    siteName: 'Maridaje Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maridaje Pro | Tu Sommelier Personal',
    description: 'Descubre el vino ideal para tu próxima comida.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js" type="module"></script>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <AppHeader />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
