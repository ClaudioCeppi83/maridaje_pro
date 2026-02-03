import { auth } from "@/auth"
import { HomePageClient } from "@/components/app/home-page-client"

export default async function Home() {
  const session = await auth()

  return (
    <HomePageClient isAuthenticated={!!session?.user} />
  )
}
