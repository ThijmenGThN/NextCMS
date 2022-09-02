import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsers(req, res) {
  let user = (await getToken({req}))

  // Fetch user from database.
  user = await prisma.user.findFirst({where: {username: user.name}})

  // Interaction rules.
  if (
    user.permission < 2 // is below moderator.
  ) return res.status(401).end()

  // Delete log from database.
  await prisma.log.delete({where: {id: req.body.params.id}})

  res.status(200).end()

  // Prisma cleanup.
  await prisma.$disconnect()
}
