import { Form, useActionData } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/node';
import type { User } from '@prisma/client';
import { useMatchesData } from '~/utils';
import Label from '~/components/Label';
import EmailInput from '~/components/EmailInput';
import Button from '~/components/Button';
import PasswordInput from '~/components/PasswordInput';
import { isDefined } from '~/validations';
import { validateEmail } from '~/validations/email';
import { checkPasswordLength } from '~/validations/password';
import { json } from '@remix-run/node';
import SuccessMessage from '~/components/SuccessMessage';
import ErrorMessage from '~/components/ErrorMessage';

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
    verifiedPassword?: string;
  };
  success?: boolean;
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData.entries()));

  const email = formData.get('email');
  const password = formData.get('password');
  const verifiedPassword = formData.get('verifiedPassword');

  const errors: ActionData['errors'] = {};

  isDefined(email);
  isDefined(password);
  isDefined(verifiedPassword);

  if (!validateEmail(email)) {
    errors.email = 'Ongeldig e-mailadres';
  }

  if (!checkPasswordLength(password)) {
    errors.password = 'Wachtwoord moet minimaal 8 tekens lang zijn';
  }

  if (password !== verifiedPassword) {
    errors.verifiedPassword = 'Wachtwoorden komen niet overeen';
  }

  console.log(errors);
  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  return json<ActionData>({ success: true });
}

export default function ProfileSettingsRoute() {
  const data = useMatchesData('routes/profile');
  const { user } = data as { user: User };
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-7xl">Instellingen</h1>

      <p>Hier kan je je instellingen veranderen.</p>

      <Form className="w-full space-y-6" method="post">
        <Label label="E-mailadres">
          <EmailInput
            name="email"
            defaultValue={user.email}
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-labelledby="email-error"
          />
          {actionData?.errors?.email ? (
            <ErrorMessage id="email-error" message={actionData?.errors.email} />
          ) : null}
        </Label>

        <Label label="Wachtwoord">
          <PasswordInput
            name="password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-labelledby="password-error"
          />
          {actionData?.errors?.password ? (
            <ErrorMessage
              id="password-error"
              message={actionData?.errors.password}
            />
          ) : null}
        </Label>

        <Label label="Herhaal wachtwoord">
          <PasswordInput
            name="verifiedPassword"
            aria-invalid={
              actionData?.errors?.verifiedPassword ? true : undefined
            }
            aria-labelledby="verified-password-error"
          />
          {actionData?.errors?.verifiedPassword ? (
            <ErrorMessage
              id="verified-password-error"
              message={actionData?.errors.verifiedPassword}
            />
          ) : null}
        </Label>

        <Button variant="primary" type="submit">
          Opslaan
        </Button>

        {actionData?.success ? (
          <SuccessMessage message="Instellingen opgeslagen" />
        ) : null}
      </Form>
    </div>
  );
}
