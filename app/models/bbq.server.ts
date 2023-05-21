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
    include: {
      upgrades: true,
      attendees: {
        include: {
          chosenUpgrades: true,
        },
      },
    },
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

export async function unattendBBQ(userId: string, bbqSlug: string) {
  const attendee = await getAttendee(bbqSlug, userId);

  return prisma.bBQ.update({
    where: { slug: bbqSlug },
    data: {
      attendees: {
        delete: { id: attendee.id },
      },
    },
  });
}

export async function updateBBQForAttendee({
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
  const attendee = await getAttendee(bbqSlug, userId);

  return prisma.bBQ.update({
    where: { slug: bbqSlug },
    include: { attendees: true },
    data: {
      attendees: {
        update: {
          where: { id: attendee.id },
          data: {
            availableDates,
            chosenUpgrades: {
              set: chosenUpgrades.map(({ id }) => ({ id })),
            },
            brings,
          },
        },
      },
    },
  });
}

export function getBBQForAttendee(bbqSlug: string, attendeeId: string) {
  // Retrieve from prisma the BBQ with the given slug where the attendee with the given id is attending
  return prisma.bBQ.findFirst({
    where: {
      slug: bbqSlug,
      attendees: { some: { userId: attendeeId } },
    },
    include: {
      upgrades: true,
      attendees: {
        where: { userId: attendeeId },
        include: {
          chosenUpgrades: true,
        },
      },
    },
  });
}

async function getAttendee(bbqSlug: string, userId: string) {
  const attendees = await prisma.bBQ.findFirst({
    where: {
      slug: bbqSlug,
      attendees: { some: { userId: userId } },
    },
    select: { attendees: { select: { id: true, userId: true } } },
  });

  if (!attendees) {
    throw new Error('Attendee not found');
  }

  const attendee = attendees.attendees.find(
    (attendee) => attendee.userId === userId,
  );

  if (!attendee) {
    throw new Error('Attendee not found');
  }

  return attendee;
}
