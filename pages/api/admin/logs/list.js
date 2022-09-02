import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsers(req, res) {
  let user = (await getToken({req}))

  // Check if user is privileged.
  user = await prisma.user.findFirst({where: {username: user.name}})
  
  // Interaction rules.
  if (
    user.permission < 1 // is below viewer.
  ) return res.status(401).end()

  // Fetch logs from database.
  const logs = await prisma.log.findMany({orderBy: {createdAt: 'desc'}})

  res.status(200).json(logs)

  // Prisma cleanup.
  await prisma.$disconnect()
}
