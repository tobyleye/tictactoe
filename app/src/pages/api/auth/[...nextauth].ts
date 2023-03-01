import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

let config = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  secret: process.env.NEXTAUTH_SECRET!,
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    }),
  ],
  secret: config.secret,
};

export default NextAuth(authOptions);
