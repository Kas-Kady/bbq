import { prisma } from '~/db.server';
import type {
  BBQ as PrismaBBQModel,
  Upgrade as PrismaUpgradeModel,
} from '@prisma/client';
import { getErrorMessage } from '~/utils';

type BBQ = Omit<PrismaBBQModel, 'createdAt' | 'updatedAt'>;

type BBQResponse = Omit<BBQ, 'date'> & {
  date: string | null;
  proposedDates: string[] | null;
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

export function getBBQsForUser(userId: string) {
  return prisma.bBQ.findMany({
    where: { attendees: { some: { userId } } },
    include: { upgrades: true },
  });
}

export function createBBQ({
  slug,
  title,
  description,
  datetime,
  proposedDates,
  upgrades,
}: {
  slug: string;
  title: string;
  description: string;
  datetime: Date | undefined;
  proposedDates: string[] | undefined;
  upgrades: Upgrade[];
}) {
  return prisma.bBQ
    .create({
      data: {
        slug,
        title,
        description,
        date: datetime,
        proposedDates,
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
  proposedDates,
  upgrades,
}: {
  id: string;
  slug: string;
  title: string;
  description: string;
  datetime: Date | undefined;
  proposedDates: string[] | undefined;
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
        proposedDates,
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

export function attendBBQ({
  userId,
  bbqSlug,
  availableDates,
  chosenUpgrades,
  brings,
}: {
  userId: string;
  bbqSlug: string;
  availableDates: string[];
  chosenUpgrades: Upgrade[];
  brings: string | null;
}) {
  return prisma.bBQ.update({
    where: { slug: bbqSlug },
    data: {
      attendees: {
        create: {
          user: { connect: { id: userId } },
          availableDates,
          chosenUpgrades: {
            connect: chosenUpgrades.map(({ id }) => ({ id })),
          },
          brings,
        },
      },
    },
  });
}
