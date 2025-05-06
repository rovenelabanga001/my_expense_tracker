import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function refreshAccessToken(refreshToken) {
  
  try {
    console.log("Refresh token sent:", refreshToken);
    const res = await fetch(`${baseURL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to refresh token");
    }

    return {
      accessToken: data["access token"],
      refreshToken: data["refresh token"] || refreshToken,
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return null;
  }
}
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const res = await fetch(`${baseURL}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (!res.ok) {
            throw new Error(user.error || "Login Failed");
          }

          return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            accessToken: user["access token"],
            refreshToken: user["refresh token"],
          };
        } catch (error) {
          console.error("Auth error: ", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      try {
        const decoded = jwtDecode(token.accessToken);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          const refreshed = await refreshAccessToken(token.refreshToken);
          if (refreshed) {
            token.accessToken = refreshed.accessToken;
            token.refreshToken = refreshed.refreshToken;
          }
        }
      } catch (error) {
        console.error("JWT decode or refresh error: ", error);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstname = token.firstname;
      session.user.lastname = token.lastname;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
