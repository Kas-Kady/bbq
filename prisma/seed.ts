import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const lody = await prisma.user.create({
    data: {
      email: 'hi@lodybo.nl',
      name: 'Lody',
      role: 'ADMIN',
      password: {
        create: {
          hash: await bcrypt.hash('lodyiscool', 10),
        }
      }
    }
  });

  const kaylee = await prisma.user.create({
    data: {
      email: 'kaylee@drakenfruit.nl',
      name: 'Kaylee',
      role: 'ADMIN',
      password: {
        create: {
          hash: await bcrypt.hash('kayleeiscool', 10),
        }
      }
    }
  });

  const daan = await prisma.user.create({
    data: {
      email: 'daan@chello.nl',
      name: 'Daan',
      password: {
        create: {
          hash: await bcrypt.hash('daaniscool', 10),
        }
      }
    }
  });

  const eva = await prisma.user.create({
    data: {
      email: 'eva@chello.nl',
      name: 'Eva',
      password: {
        create: {
          hash: await bcrypt.hash('evaiscool', 10),
        }
      }
    }
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
