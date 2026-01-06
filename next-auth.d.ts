import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ✅ Menambahkan ID ke tipe data user
    } & DefaultSession["user"];
  }
}