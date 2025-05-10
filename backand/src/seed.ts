import { $Enums, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { parseArgs } from 'node:util';

const prisma = new PrismaClient();

async function generatePermissions() {
  const {
    values: { email, password, name },
  } = parseArgs({
    options: {
      email: { type: 'string', short: 'e' },
      password: { type: 'string', short: 'p' },
      name: { type: 'string', short: 'n' },
    },
    strict: true,
  });

  if (!email || !password || !name) {
    console.error('❌ Необходимо указать --e(email) --p(password) --n(name)');
    process.exit(1);
  }

  const permissions: string[] = [];

  for (const entity of Object.values($Enums.Entity)) {
    for (const action of Object.values($Enums.Action)) {
      permissions.push(`${entity}_${action}`);
    }
  }

  // Здесь мы заполняем в базу данных, используя метод upsert
  const createdPermission = await Promise.all(
    permissions.map((permission) =>
      prisma.permission.upsert({
        where: { value: permission },
        update: {},
        create: { value: permission },
      }),
    ),
  );

  const { id } = await prisma.role.upsert({
    where: { name: 'Администратор' },
    create: {
      name: 'Администратор',
      permissions: {
        connect: createdPermission.map((el) => ({
          value: el.value,
        })),
      },
    },
    update: {},
  });

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name,
      role: {
        connect: {
          id,
        },
      },
    },
  });
}

// Запускаем генерацию
generatePermissions()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
