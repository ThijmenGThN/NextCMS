import bcrypt from 'bcrypt'
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize({username, password}) {
        // Fetch user by username from database.
        let user = await prisma.User.findFirst({where: {username}})
        
        // Cleanup prisma connection.
        await prisma.$disconnect()

        // Validate password.
        if (!await bcrypt.compare(password, user.password)) return null

        // Verify if user may sign in.
        if (user.permission < 1) return null
        
        // Session valid.
        return {name: username}
      }
    })
  ],
  callbacks: {
    async session({session}) {
      // Fetch user by username from database.
      let user = await prisma.User.findFirst({where: {username: session.user.name}})
        
      // Cleanup prisma connection.
      await prisma.$disconnect()

      // Inject database data into session.
      session.user.permission = user.permission

      return { ...session }
    }
  },
  pages: {
    signIn: "/admin",
    error: '/admin'
  }
})
