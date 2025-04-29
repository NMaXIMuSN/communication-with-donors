import { $Enums, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generatePermissions() {
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

  await prisma.role.upsert({
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

  await prisma.user.update({
    where: {
      id: 1,
    },
    data: {
      role: {
        connect: {
          name: 'Администратор',
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
