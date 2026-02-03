import { signInAction, signOutAction } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

export function SignIn(props: React.ComponentProps<typeof Button>) {
  return (
    <form action={signInAction}>
      <Button variant="default" size="sm" {...props}>
        <User className="mr-2 h-4 w-4" />
        Iniciar Sesión
      </Button>
    </form>
  )
}

export function SignOut() {
  return (
    <form action={signOutAction} className="w-full">
      <button type="submit" className="flex w-full items-center text-red-500">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </button>
    </form>
  )
}

export function UserButton({
  user,
}: {
  user?: { name?: string | null; email?: string | null; image?: string | null }
}) {
  if (!user) return <SignIn />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
