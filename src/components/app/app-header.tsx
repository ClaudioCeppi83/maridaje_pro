import { Wine } from 'lucide-react';
import Link from 'next/link';
import { auth } from "@/auth"
import { UserButton, SignIn } from "@/components/auth/auth-components"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95" aria-label="Maridaje Pro Inicio">
          <Wine className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            Maridaje Pro
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserButton user={session.user} />
          ) : (
            <div className="min-h-[44px] flex items-center">
              <SignIn />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
