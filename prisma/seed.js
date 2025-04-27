const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const admin = await prisma.user.findUnique({
    where: { email: 'meta@ymail.com' },
  });

  if (!admin) {
    // Create an admin user
    const hashedPassword = await bcrypt.hash('metapassword', 10);

    await prisma.user.create({
      data: {
        email: 'meta@ymail.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        status: 'ACTIVE',
        registrationNo: '123456',
        dateOfBirth: new Date('2000-01-01'),
      },
    });

    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
