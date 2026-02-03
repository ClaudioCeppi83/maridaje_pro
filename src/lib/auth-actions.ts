"use server"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth"

export async function signInAction() {
  await nextAuthSignIn("google")
}

export async function signOutAction() {
  await nextAuthSignOut()
}
