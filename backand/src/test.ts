import {
  BloodType,
  DonationType,
  GenderData,
  Prisma,
  PrismaClient,
  RHFactorType,
} from '@internal/prisma/client';
import { faker } from '@faker-js/faker'; // используем faker для генерации данных

const prisma = new PrismaClient();

export async function generateRandomDonorData(count: number = 100000) {
  const donors: Prisma.DonorCreateArgs['data'][] = [];

  for (let i = 0; i < count; i++) {
    const randomGender =
      Math.random() < 0.5 ? GenderData.MANE : GenderData.WOMEN;
    const randomBloodType = faker.helpers.arrayElement(
      Object.values(BloodType),
    );
    const randomRHFactor = faker.helpers.arrayElement(
      Object.values(RHFactorType),
    );

    const donorRecord: Prisma.DonorCreateArgs['data'] = {
      fullName: faker.person.fullName(),
      birthDate: faker.date.birthdate(),
      gender: randomGender,
      address: faker.address.streetAddress(),
      phone: faker.phone.number(),
      email: '89774964874m@gmail.com',
      telegram: '472238739',
      vk: faker.internet.userName(),
      medicalInfo: {
        create: {
          bloodType: randomBloodType,
          rhFactor: randomRHFactor,
          weight: faker.number.float({ min: 50, max: 100, fractionDigits: 1 }),
          height: faker.number.float({ min: 150, max: 200, fractionDigits: 1 }),
          lastDonation: faker.date.anytime(),
        },
      },
      donations: {
        createMany: {
          data: Array.from({
            length: faker.number.int({ min: 0, max: 5 }),
          }).map(() => ({
            donationDate: faker.date.past(),
            donationType: faker.helpers.arrayElement(
              Object.values(DonationType),
            ),
            bloodVolume: faker.number.float({
              min: 200,
              max: 500,
              fractionDigits: 1,
            }),
            donationLocation: faker.address.city(),
          })),
        },
      },
    };

    donors.push(donorRecord);
  }

  await Promise.all(
    donors.map(async (data) => {
      try {
        await prisma.donor.create({
          data,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  ).catch((e) => console.log(e));
}

generateRandomDonorData(100000);
