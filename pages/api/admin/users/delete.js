import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsersDelete(req, res) {
  let user = (await getToken({req}))

  // Fetch user from database.
  user = await prisma.user.findFirst({where: {username: user.name}})

  // Fetch target from database.
  let target = await prisma.user.findFirst({where: {username: req.body.params.username}})
  
  // Interaction rules.
  if (
    user.permission < 2 || // is below moderator.
    user.permission < target.permission // edits higher privileged user.
  ) return res.status(401).end()

  // Update user in database.
  await prisma.user.delete({where: {username: target.username}})

  res.status(200).end()

  // Create a log for this event.
  await prisma.log.create({data: {
    user: user.username,
    context: `User "${target.username}" has been deleted.`
  }})

  // Prisma cleanup.
  await prisma.$disconnect()
}
