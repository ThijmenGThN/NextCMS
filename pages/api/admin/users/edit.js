import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { getToken } from "next-auth/jwt"

// Connect to Prisma client.
const prisma = new PrismaClient()

export default async function AdminUsersEdit(req, res) {
  let user = (await getToken({req}))

  // Fetch user from database.
  user = await prisma.user.findFirst({where: {username: user.name}})

  // Fetch target from database.
  let target = await prisma.user.findFirst({where: {username: req.body.params.username}})
  
  // Interaction rules.
  if (
    user.permission < 2 || // is below moderator.
    user.permission < parseInt(req.body.params.permission, 10) || // gives role above it's own.
    user.permission < target.permission // edits higher privileged user.
  ) return res.status(401).end()

  // Prebuild dataset.
  let data = {
    username: req.body.params.username,
    permission: parseInt(req.body.params.permission, 10)
  }
  
  // Apply password to dataset if requested by client.
  if (req.body.params.password) data.password = await bcrypt.hash(req.body.params.password, 12)

  // Update user in database.
  await prisma.user.update({
    where: {username: data.username},
    data
  })

  res.status(200).end()

  // Create a log for this event.
  await prisma.log.create({data: {
    user: user.username,
    context: `Changes of user "${target.username}"` + (req.body.params.password ? ', the password has been updated' : '') +
             (target.permission != req.body.params.permission ? ', their role was changed' : '') + '.'
  }})

  // Prisma cleanup.
  await prisma.$disconnect()
}
