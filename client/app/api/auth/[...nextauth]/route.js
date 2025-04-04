import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const res = await fetch(
          "http://localhost:3001/users?email=" + credentials.email
        );

        const users = await res.json();
        const user = users[0];

        if (user && user.password === credentials.password) {
          return { id: user.id, name: user.username, email: user.email };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
