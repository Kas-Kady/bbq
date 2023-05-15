import { prisma } from '~/db.server';
import type {
  BBQ as PrismaBBQModel,
  Upgrade as PrismaUpgradeModel,
} from '@prisma/client';
import { getErrorMessage } from '~/utils';

type BBQ = Omit<PrismaBBQModel, 'createdAt' | 'updatedAt'>;

type BBQResponse = Omit<BBQ, 'date'> & {
  date: string;
};

type Upgrade = Omit<PrismaUpgradeModel, 'createdAt' | 'updatedAt'>;

export type { BBQ, BBQResponse, Upgrade };

export function getBBQs() {
  return prisma.bBQ.findMany();
}

export function getBBQ(slug: string) {
  return prisma.bBQ.findUnique({
    where: { slug },
    include: { upgrades: true },
  });
}

export function createBBQ({
  slug,
  title,
  description,
  datetime,
  upgrades,
}: {
  slug: string;
  title: string;
  description: string;
  datetime: Date;
  upgrades: Upgrade[];
}) {
  return prisma.bBQ
    .create({
      data: {
        slug,
        title,
        description,
        date: datetime,
        upgrades: {
          createMany: {
            data: upgrades.map(({ description, amount }) => ({
              description,
              amount,
            })),
          },
        },
      },
    })
    .catch((err) => {
      const message = getErrorMessage(err);
      throw new Error(`Failed to create BBQ: ${message}`);
    });
}

export function updateBBQ({
  id,
  slug,
  title,
  description,
  datetime,
  upgrades,
}: {
  id: string;
  slug: string;
  title: string;
  description: string;
  datetime: Date;
  upgrades: Upgrade[];
}) {
  return prisma.bBQ
    .update({
      where: { id },
      data: {
        slug,
        title,
        description,
        date: datetime,
        upgrades: {
          deleteMany: {},
          createMany: {
            data: upgrades.map(({ description, amount }) => ({
              description,
              amount,
            })),
          },
        },
      },
    })
    .catch((err) => {
      const message = getErrorMessage(err);
      throw new Error(`Failed to update BBQ: ${message}`);
    });
}
