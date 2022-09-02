import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsersList(req, res) {
  let user = (await getToken({req}))

  // Check if user is privileged.
  user = await prisma.user.findFirst({where: {username: user.name}})

  // Interaction rules.
  if (
    user.permission < 1 // is below viewer.
  ) return res.status(401).end()

  // Fetch users from database.
  const users = (
    await prisma.user.findMany({orderBy: {permission: 'desc'}}))
      .map(user => {
        delete user.password
        return user
      }
  )

  res.status(200).json(users)

  // Prisma cleanup.
  await prisma.$disconnect()
}
