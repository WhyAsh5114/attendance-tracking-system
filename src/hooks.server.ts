import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "$lib/mongo/mongodb";
import {
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_SECRET
} from "$env/static/private";

export const handle = SvelteKitAuth({
  basePath: "/auth",
  providers: [
    Google({ clientId: AUTH_GOOGLE_ID, clientSecret: AUTH_GOOGLE_SECRET }),
  ],
  // @ts-expect-error: still in beta
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "database" },
  callbacks: {
    // Attach mongoDB user document ID for easier queries
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  },
  secret: AUTH_SECRET,
  trustHost: true
});
