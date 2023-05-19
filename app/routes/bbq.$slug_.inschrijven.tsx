import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { getBBQ } from '~/models/bbq.server';
import { getUser } from '~/session.server';
import { useLoaderData } from '@remix-run/react';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import Checkbox from '~/components/Checkbox';
import { useState } from 'react';
import EmailInput from '~/components/EmailInput';
import PasswordInput from '~/components/PasswordInput';
import DatePicker from '~/components/DatePicker';

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  return json({ user, bbq });
}

export default function BBQAttendanceRoute() {
  const { bbq } = useLoaderData<typeof loader>();
  const [createAccount, setCreateAccount] = useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateAccount(event.target.checked);
  };

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

        <form className="w-full max-w-lg space-y-6">
          <Label label="Wat is je naam?" stacked>
            <TextInput name="name" />
          </Label>

          <div>
            <Label label="Wil je een account aanmaken?" stacked={false}>
              <Checkbox
                name="createAccount"
                defaultChecked={createAccount}
                onChange={handleCheckboxChange}
              />
            </Label>
            <p className="text-sm">
              Met een account kun je later nog je aanwezigheid{' '}
              {bbq.upgrades.length > 0 ? ' en upgrades ' : ''} wijzigen. Op een
              later stadium kunnen we je via de mail laten weten wanneer er een
              datum is geprikt.
            </p>
          </div>

          {createAccount ? (
            <>
              <Label label="Wat is je e-mailadres?" stacked>
                <EmailInput name="email" />
              </Label>

              <Label label="Kies een wachtwoord" stacked>
                <PasswordInput name="password" />
              </Label>

              <Label label="Herhaal je wachtwoord" stacked>
                <PasswordInput name="password-verify" />
              </Label>
            </>
          ) : null}

          {bbq.proposedDates.length > 0 ? (
            <>
              <h2 className="text-xl">Op welke datums zou je kunnen?</h2>
              <DatePicker name="attendance-dates" dates={bbq.proposedDates} />
            </>
          ) : null}
        </form>
      </MainLayout>
    </>
  );
}
