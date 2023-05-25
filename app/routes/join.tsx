import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { createUser, getUserByEmail } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect } from '~/utils';
import { validateEmail } from '~/validations/email';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import Button from '~/components/Button';
import { checkPasswordLength, validatePassword } from '~/validations/password';
import invariant from 'tiny-invariant';
import { isDefined } from '~/validations';
import { ROLE } from '@prisma/client';
import ErrorMessage from '~/components/ErrorMessage';
import Anchor from '~/components/Anchor';
import Navigation from '~/components/Navigation';

type ActionData = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const formDataRole = formData.get('role');

  const errors: ActionData['errors'] = {};

  isDefined(name);
  isDefined(email);
  isDefined(password);

  if (!name) {
    errors.name = 'Naam is verplicht';
  }

  if (!validateEmail(email)) {
    errors.email = 'Email is verplicht';
  }

  if (!validatePassword(password) && !checkPasswordLength(password)) {
    errors.password = 'Wachtwoord is verplicht';
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    errors.email = 'Er bestaat al een account met dit emailadres';
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 422 });
  }

  let role: ROLE = 'USER';
  if (typeof formDataRole === 'string' && formDataRole === 'admin') {
    role = 'ADMIN';
  }

  const user = await createUser(name, email, password, role);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: 'Maak account aan' }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const role = searchParams.get('role') ?? 'user';
  const actionData = useActionData<ActionData>();

  return (
    <>
      <Navigation />
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-md px-8">
          <Form method="post" className="space-y-6">
            <Label label="Naam">
              <TextInput
                name="name"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-labelledby="name-error"
              />
              {actionData?.errors?.name && (
                <ErrorMessage
                  id="name-error"
                  message={actionData.errors.name}
                />
              )}
            </Label>

            <Label label="Email">
              <EmailInput
                name="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-labelledby="email-error"
              />
              {actionData?.errors?.email && (
                <ErrorMessage
                  id="email-error"
                  message={actionData.errors.email}
                />
              )}
            </Label>

            <Label label="Password">
              <PasswordInput
                name="password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-labelledby="password-error"
              />
              {actionData?.errors?.password && (
                <ErrorMessage
                  id="password-error"
                  message={actionData.errors.password}
                />
              )}
            </Label>

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <input type="hidden" name="role" value={role} />

            <Button variant="primary" className="w-full" type="submit">
              Maak account aan
            </Button>
            <div className="flex items-center justify-end">
              <div className="text-sm text-gray-500">
                Heb je al een account?{' '}
                <Anchor
                  to={{
                    pathname: '/login',
                    search: searchParams.toString(),
                  }}
                >
                  Log dan in
                </Anchor>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
