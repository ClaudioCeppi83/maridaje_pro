import { Wine } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Maridaje Pro Inicio">
          <Wine className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Maridaje Pro
          </span>
        </Link>
      </div>
    </header>
  );
}
