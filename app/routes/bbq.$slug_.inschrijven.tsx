import { useState } from 'react';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import type { User } from '@prisma/client';
import type { Upgrade } from '~/models/bbq.server';
import { attendBBQ, getBBQ } from '~/models/bbq.server';
import { getUser } from '~/session.server';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import Checkbox from '~/components/Checkbox';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import DatePicker from '~/components/DatePicker';
import PickList from '~/components/PickList';
import { mapUpgradesToPickItems } from '~/utils';
import Button from '~/components/Button';
import ErrorMessage from '~/components/ErrorMessage';
import { createUser, getUserByEmail } from '~/models/user.server';

type ActionData = {
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    verifiedPassword?: string;
    dates?: string;
  };
  succes?: boolean;
};

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  return json({ user, bbq });
}

export async function action({ request, params }: ActionArgs) {
  const user = await getUser(request);
  const { slug } = params;
  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);
  invariant(bbq !== null, 'No BBQ found.');

  const formData = await request.formData();

  const name = formData.get('name');
  const createAccount = formData.get('create-account');
  const email = formData.get('email');
  const password = formData.get('password');
  const verifiedPassword = formData.get('password-verify');
  const brings = formData.get('brings');
  const dates = formData.get('attendance-dates');
  const upgrades = formData.get('upgrades');

  let errors: ActionData['errors'] = {};
  let attendee: User | undefined = undefined;

  invariant(
    typeof brings === 'string' ||
      typeof brings === 'undefined' ||
      brings === null,
    'Name needs to be a string',
  );

  if (typeof name !== 'string' || !name) {
    errors.name = 'Vul je naam in.';
  }
  invariant(typeof name === 'string', 'Name needs to be a string');

  if (typeof email !== 'string' || !email) {
    errors.email = 'Vul je e-mailadres in.';
  }
  invariant(typeof email === 'string', 'Email needs to be a string');

  if (user) {
    attendee = user;
  } else {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      attendee = existingUser;
    } else if (createAccount && createAccount === 'on') {
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

      if (password !== verifiedPassword) {
        errors.password = 'Wachtwoorden komen niet overeen.';
      }

      if (Object.keys(errors).length === 0) {
        attendee = await createUser(name, email, password);
      }
    } else {
      if (Object.keys(errors).length === 0) {
        attendee = await createUser(name, email);
      }
    }
  }

  if (typeof dates !== 'string' || !dates) {
    errors.dates = 'Kies een datum.';
  }
  invariant(typeof dates === 'string', 'Dates needs to be a string');

  const attendanceDates = (dates as string).split(',');

  let attendanceUpgrades: Upgrade[] = [];
  if (upgrades && typeof upgrades === 'string' && upgrades !== '') {
    const chosenUpgrades = (upgrades as string).split(',');
    attendanceUpgrades = bbq.upgrades.filter((upgrade) =>
      chosenUpgrades.includes(upgrade.description),
    );
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  invariant(typeof attendee !== 'undefined', 'Attendee needs to be set');

  await attendBBQ({
    userId: attendee?.id,
    bbqSlug: slug,
    brings,
    availableDates: attendanceDates,
    chosenUpgrades: attendanceUpgrades,
  });

  return json<ActionData>({ succes: true });
}

export default function BBQAttendanceRoute() {
  const { user, bbq } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [createAccount, setCreateAccount] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAccount(event.target.checked);
  };

  const upgrades = mapUpgradesToPickItems(bbq.upgrades);

  return (
    <>
      <Navigation />

      <MainLayout>
        {actionData?.succes ? (
          <>
            <h1 className="font-handwriting text-7xl">Bedankt!</h1>
            <p className="my-14 w-1/2 text-2xl">
              Je bent ingeschreven voor {bbq.title}. We laten je zo snel
              mogelijk weten wanneer je welkom bent!
            </p>
            <Link to={`/bbq/${bbq.slug}`}>Terug naar de BBQ</Link>
          </>
        ) : (
          <>
            <h1 className="font-handwriting text-7xl">
              Inschrijven voor {bbq.title}
            </h1>

            <p className="my-14 w-full text-2xl lg:w-1/2">
              Leuk dat je erbij bent! Vul hieronder je gegevens in en kies op
              welke data je kan. We laten je zo snel mogelijk weten wanneer je
              welkom bent.
            </p>

            <Form
              method="post"
              className="grid w-full grid-cols-1 gap-10 md:grid-cols-2"
            >
              <div className="space-y-6">
                <Label label="Wat is je naam?" stacked>
                  <TextInput
                    name="name"
                    defaultValue={user?.name}
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

                <Label label="Wat is je e-mailadres?" stacked>
                  <EmailInput
                    name="email"
                    defaultValue={user?.email}
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

                {!user ? (
                  <div>
                    <Label
                      label="Wil je een account aanmaken?"
                      stacked={false}
                      className="!flex-row"
                    >
                      <Checkbox
                        name="create-account"
                        defaultChecked={createAccount}
                        onChange={handleCheckboxChange}
                      />
                    </Label>
                    <p className="text-sm">
                      Met een account kun je later nog je aanwezigheid{' '}
                      {bbq.upgrades.length > 0 ? ' en upgrades ' : ''} voor je
                      aangemelde BBQ's wijzigen.
                    </p>
                  </div>
                ) : null}

                {createAccount ? (
                  <>
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
                          actionData?.errors?.verifiedPassword
                            ? true
                            : undefined
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
                    <DatePicker
                      name="attendance-dates"
                      dates={bbq.proposedDates}
                    />
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
            </Form>
          </>
        )}
      </MainLayout>
    </>
  );
}
