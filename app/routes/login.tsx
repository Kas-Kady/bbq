import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUser } from '~/session.server';

import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import Button from '~/components/Button';
import { validateEmail } from '~/validations/email';
import { checkPasswordLength, validatePassword } from '~/validations/password';
import invariant from 'tiny-invariant';
import { safeRedirect } from '~/utils';

type LoginActionData = {
  errors?: {
    email?: string;
    password?: string;
    loginFailed?: boolean;
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/profile');
  }

  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  const remember = formData.get('remember');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/profile');

  const errors: LoginActionData['errors'] = {};

  if (!validateEmail(email)) {
    errors.email = 'E-mailadres is ongeldig';
  }

  if (!validatePassword(password)) {
    errors.password = 'Wachtwoord is verplicht';
  }

  if (!checkPasswordLength(password as string)) {
    errors.password = 'Wachtwoord is te kort';
  }

  if (Object.keys(errors).length > 0) {
    return json<LoginActionData>({ errors }, { status: 400 });
  }

  invariant(typeof email === 'string', 'Email is not a string');
  invariant(typeof password === 'string', 'Password is not a string');

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<LoginActionData>(
      { errors: { loginFailed: true } },
      { status: 401 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on',
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: 'Login' }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              E-mailadres
            </label>
            <div className="mt-1">
              <EmailInput
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Wachtwoord
            </label>
            <div className="mt-1">
              <PasswordInput
                id="password"
                ref={passwordRef}
                name="password"
                autoComplete="current-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button className="w-full" type="submit" variant="primary">
            Inloggen
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Onthoud mij
              </label>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
