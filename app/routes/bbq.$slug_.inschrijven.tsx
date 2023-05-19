import { useState } from 'react';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getBBQ } from '~/models/bbq.server';
import { getUser } from '~/session.server';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import Checkbox from '~/components/Checkbox';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import DatePicker from '~/components/DatePicker';
import type { PickListItem } from '~/components/PickList';
import PickList from '~/components/PickList';
import { formatAmountToLocale } from '~/utils';
import Button from '~/components/Button';
import ErrorMessage from '~/components/ErrorMessage';

type ActionData = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    verifiedPassword?: string;
    dates?: string;
  };
};

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  return json({ user, bbq });
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);

  const formData = await request.formData();

  const name = formData.get('name');
  const createAccount = formData.get('create-account');
  const email = formData.get('email');
  const password = formData.get('password');
  const verifiedPassword = formData.get('password-verify');
  const brings = formData.get('brings');
  const dates = formData.get('dates');
  const upgrades = formData.get('upgrades');

  let errors: ActionData['errors'] = {};

  if (typeof name !== 'string' || !name) {
    errors.name = 'Vul je naam in.';
  }
  invariant(typeof name === 'string', 'Name needs to be a string');

  if (createAccount && createAccount === 'on') {
    if (typeof email !== 'string' || !email) {
      errors.email = 'Vul je e-mailadres in.';
    }
    invariant(typeof email === 'string', 'Email needs to be a string');

    if (typeof password !== 'string' || !password) {
      errors.password = 'Vul een wachtwoord in.';
    }
    invariant(typeof password === 'string', 'Password needs to be a string');

    if (typeof verifiedPassword !== 'string' || !verifiedPassword) {
      errors.verifiedPassword = 'Bevestig je wachtwoord.';
    }
    invariant(
      typeof verifiedPassword === 'string',
      'Password needs to be a string',
    );

    console.log('password', password, 'verifiedPassword', verifiedPassword);
    if (password !== verifiedPassword) {
      errors.password = 'Wachtwoorden komen niet overeen.';
    }
  }

  if (typeof dates !== 'string' || !dates) {
    errors.dates = 'Kies een datum.';
  }
  invariant(typeof dates === 'string', 'Dates needs to be a string');

  const attendanceDates = (dates as string).split(',');

  let attendanceUpgrades: string[] = [];
  if (upgrades && typeof upgrades === 'string' && upgrades !== '') {
    attendanceUpgrades = (upgrades as string).split(',');
  }

  console.log('errors', errors);

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  console.log('result', {
    name,
    email,
    password: password ? password : 'no account created',
    brings,
    attendanceDates,
    attendanceUpgrades,
  });

  return json<ActionData>({});
}

export default function BBQAttendanceRoute() {
  const { user, bbq } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [createAccount, setCreateAccount] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAccount(event.target.checked);
  };

  let upgrades: PickListItem[] = bbq.upgrades.map(({ description, amount }) => {
    return {
      label: `${description} (+ ${formatAmountToLocale(amount)})`,
      value: description,
    };
  });

  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="font-handwriting text-7xl">
          Inschrijven voor {bbq.title}
        </h1>

        <p className="my-14 w-1/2 text-2xl">
          Leuk dat je erbij bent! Vul hieronder je gegevens in en kies op welke
          data je kan. We laten je zo snel mogelijk weten wanneer je welkom
          bent.
        </p>

        <form method="post" className="grid w-full grid-cols-2 gap-10">
          <div className="space-y-6">
            <Label label="Wat is je naam?" stacked>
              <TextInput
                name="name"
                aria-invalid={actionData?.errors?.name ? true : undefined}
                aria-describedby="name-error"
              />
              {actionData?.errors?.name ? (
                <ErrorMessage
                  id="name-error"
                  message={actionData.errors.name}
                />
              ) : null}
            </Label>

            {!user ? (
              <div>
                <Label label="Wil je een account aanmaken?" stacked={false}>
                  <Checkbox
                    name="create-account"
                    defaultChecked={createAccount}
                    onChange={handleCheckboxChange}
                  />
                </Label>
                <p className="text-sm">
                  Met een account kun je later nog je aanwezigheid{' '}
                  {bbq.upgrades.length > 0 ? ' en upgrades ' : ''} wijzigen. Op
                  een later stadium kunnen we je via de mail laten weten wanneer
                  er een datum is geprikt.
                </p>
              </div>
            ) : null}

            {createAccount ? (
              <>
                <Label label="Wat is je e-mailadres?" stacked>
                  <EmailInput
                    name="email"
                    aria-invalid={actionData?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                  />
                  {actionData?.errors?.email ? (
                    <ErrorMessage
                      id="email-error"
                      message={actionData.errors.email}
                    />
                  ) : null}
                </Label>

                <Label label="Kies een wachtwoord" stacked>
                  <PasswordInput
                    name="password"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.password ? true : undefined
                    }
                    aria-describedby="password-error"
                  />
                  {actionData?.errors?.password ? (
                    <ErrorMessage
                      id="password-error"
                      message={actionData.errors.password}
                    />
                  ) : null}
                </Label>

                <Label label="Herhaal je wachtwoord" stacked>
                  <PasswordInput
                    name="password-verify"
                    autoComplete="new-password"
                    aria-invalid={
                      actionData?.errors?.verifiedPassword ? true : undefined
                    }
                    aria-describedby="verified-password-error"
                  />
                  {actionData?.errors?.verifiedPassword ? (
                    <ErrorMessage
                      id="verified-password-error"
                      message={actionData.errors.verifiedPassword}
                    />
                  ) : null}
                </Label>
              </>
            ) : null}

            <Label label="Wat neem je mee (optioneel)?" stacked>
              <TextInput name="brings" multiline />
            </Label>
          </div>

          <div className="space-y-6">
            {bbq.proposedDates.length > 0 ? (
              <>
                <h2>Op welke datums zou je kunnen?</h2>
                <DatePicker name="attendance-dates" dates={bbq.proposedDates} />
                {actionData?.errors?.dates ? (
                  <ErrorMessage id="" message={actionData.errors.dates} />
                ) : null}
              </>
            ) : null}

            {bbq.upgrades.length > 0 ? (
              <div className="space-y-2">
                <h2>Wil je een upgrade?</h2>
                <PickList name="upgrades" items={upgrades} />
                <p className="text-sm italic">
                  Upgrades af te rekenen bij de BBQ met geld of dansjes.
                </p>
              </div>
            ) : null}
          </div>

          <Button variant="primary" type="submit">
            Inschrijven
          </Button>
        </form>
      </MainLayout>
    </>
  );
}
