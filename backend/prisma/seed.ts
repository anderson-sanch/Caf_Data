import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required to run the seed`);
  }

  return value;
}

const connectionString = requiredEnvironmentVariable('DATABASE_URL');
const adminEmail = requiredEnvironmentVariable('ADMIN_EMAIL');
const adminPassword = requiredEnvironmentVariable('ADMIN_PASSWORD');
const adminName = process.env.ADMIN_NAME ?? 'Administrador CafData';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const [administratorRole] = await Promise.all([
    prisma.roles.upsert({
      where: { name: 'Administrador' },
      update: { description: 'Administración general de CafData' },
      create: {
        name: 'Administrador',
        description: 'Administración general de CafData',
      },
    }),
    prisma.roles.upsert({
      where: { name: 'Operador' },
      update: { description: 'Operación básica de CafData' },
      create: {
        name: 'Operador',
        description: 'Operación básica de CafData',
      },
    }),
  ]);

  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.users.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password,
      role_id: administratorRole.id,
      is_active: true,
      deleted_at: null,
      updated_at: new Date(),
    },
    create: {
      name: adminName,
      email: adminEmail,
      password,
      role_id: administratorRole.id,
      is_active: true,
    },
  });

  console.log(
    'Seed completed: roles Administrador/Operador and initial administrator are ready.',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
