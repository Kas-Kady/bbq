import { prisma } from '~/db.server';
import type { BBQ } from '@prisma/client';
import type { Upgrade } from '~/types/Upgrade';

type BBQResponse = Omit<BBQ, 'date'> & { date: string };

export type { BBQ, BBQResponse };

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
  return prisma.bBQ.create({
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
  });
}
