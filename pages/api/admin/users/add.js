import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsersAdd(req, res) {
  let user = (await getToken({req}))

  // Fetch user from database.
  user = await prisma.user.findFirst({where: {username: user.name}})

  // Interaction rules.
  if (
    user.permission < 2 || // is below moderator.
    user.permission < parseInt(req.body.params.permission, 10) // gives role above it's own.
  ) return res.status(401).end()

  // Prebuild dataset.
  let data = {
    username: req.body.params.username,
    password: await bcrypt.hash(req.body.params.password, 12),
    permission: parseInt(req.body.params.permission, 10)
  }
  
  // Update user in database.
  await prisma.user.create({
    data
  })

  res.status(200).end()

  // Create a log for this event.
  await prisma.log.create({data: {
    user: user.username,
    context: `A new user named "${target.username}" has been added.`
  }})

  // Prisma cleanup.
  await prisma.$disconnect()
}
