import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/lib/firebase/admin"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/generative-language.retriever https://www.googleapis.com/auth/generative-language.peruserquota",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  trustHost: true,
  // debug: true,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
      }
      return {
        ...session,
        accessToken: token.accessToken
      } as any
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id || !user.email) return;

      const userRef = db.collection('users').doc(user.id);
      const doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          id: user.id,
          email: user.email,
          displayName: user.name || null,
          photoURL: user.image || null,
          isCellarModeEnabled: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } else {
        // Optional: Update basic profile info if it changed
        await userRef.update({
          displayName: user.name || null,
          photoURL: user.image || null,
          updatedAt: Date.now(),
        });
      }
    }
  }
})
