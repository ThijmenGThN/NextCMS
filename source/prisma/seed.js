const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

// Connect to Prisma client.
const prisma = new PrismaClient()

// Main async loop
;(async () => {
  let password = Math.random().toString(36).slice(2, 12)
  
  console.log(`\n-- Administrator Credentials -- \n\n   Username: "admin"\n   Password: "${password}"`)

  password = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: {username: 'admin'},
    update: {},
    create: {
      username: 'admin',
      password,
      permission: 4
    }
  })

  await prisma.user.upsert({
    where: {username: 'steve'},
    update: {},
    create: {
      username: 'steve',
      password,
      permission: 2
    }
  })

  await prisma.user.upsert({
    where: {username: 'johan'},
    update: {},
    create: {
      username: 'johan',
      password,
      permission: 1
    }
  })

  await prisma.user.upsert({
    where: {username: 'tyler'},
    update: {},
    create: {
      username: 'tyler',
      password,
      permission: 0
    }
  })

  // ----- LOGS -----

  await prisma.log.create({data: {
    user: 'System',
    context: 'Database has been seeded.'
  }})

  // Prisma cleanup.
  await prisma.$disconnect()

})()

