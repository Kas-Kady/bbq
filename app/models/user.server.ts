import type { Password, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';

import { prisma } from '~/db.server';

export type { User } from '@prisma/client';

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  name: string,
  email: User['email'],
  password?: string,
) {
  const data: Prisma.UserCreateArgs['data'] = {
    name,
    email,
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = {
      create: {
        hash: hashedPassword,
      },
    };
  }

  return prisma.user.create({
    data,
  });
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash'],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function hasPassword(email: User['email']) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  return !!user?.password;
}
