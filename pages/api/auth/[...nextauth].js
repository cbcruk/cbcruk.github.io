import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (process.env.ADMIN_EMAIL.includes(token.email)) {
        token.role = 'admin'
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.role = token.role

      return session
    },
  },
}

export default NextAuth(authOptions)
