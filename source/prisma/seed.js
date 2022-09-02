const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

// Connect to Prisma client.
const prisma = new PrismaClient()

// Main async loop
;(async () => {
  let password = Math.random().toString(36).slice(2, 12)
  console.log(`\n-- Administrator Credentials --\n\n   Username: "admin"\n   Password: "${password}"`)

  // ----- CLEAN -----

  try { 
    await prisma.user.delete({where: {username: 'admin'}}) 
  } catch(err) {}

  // ----- USERS -----

  await prisma.user.create({data: {
    username: 'admin',
    password: await bcrypt.hash(password, 12),
    permission: 4
  }})

  // ----- LOGS -----

  await prisma.log.create({data: {
    user: 'System',
    context: 'Database has been seeded.'
  }})

  // Prisma cleanup.
  await prisma.$disconnect()

})()

