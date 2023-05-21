import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/session.server';
import invariant from 'tiny-invariant';
import type { Upgrade } from '~/models/bbq.server';
import { getBBQForAttendee, updateBBQForAttendee } from '~/models/bbq.server';
import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react';
import TextInput from '~/components/TextInput';
import Label from '~/components/Label';
import DatePicker from '~/components/DatePicker';
import ErrorMessage from '~/components/ErrorMessage';
import PickList from '~/components/PickList';
import { mapUpgradesToPickItems } from '~/utils';
import Button from '~/components/Button';

type ActionData = {
  errors?: {
    dates?: string;
  };
  succes?: boolean;
};

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQForAttendee(slug, user.id);

  invariant(bbq !== null, 'No BBQ found.');

  const attendee = bbq.attendees[0];
  invariant(attendee !== undefined, 'No attendee found.');

  return json({ user, bbq, attendee });
}

export async function action({ request, params }: ActionArgs) {
  const user = await requireUser(request);

  const { slug } = params;
  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQForAttendee(slug, user.id);
  invariant(bbq !== null, 'No BBQ found.');

  const errors: ActionData['errors'] = {};

  const formData = await request.formData();
  const brings = formData.get('brings') as string;
  const dates = formData.get('attendance-dates') as string;
  const upgrades = formData.get('upgrades') as string;

  if (!dates) {
    errors.dates = 'Kies een datum.';
  }
  invariant(dates !== undefined, 'Dates needs to be a string');

  const attendanceDates = dates.split(',');

  let attendanceUpgrades: Upgrade[] = [];
  if (upgrades && upgrades !== '') {
    const chosenUpgrades = upgrades.split(',');
    attendanceUpgrades = bbq.upgrades.filter((upgrade) =>
      chosenUpgrades.includes(upgrade.description),
    );
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors });
  }

  console.log(user.id);

  await updateBBQForAttendee({
    bbqSlug: slug,
    userId: user.id,
    brings,
    availableDates: attendanceDates,
    chosenUpgrades: attendanceUpgrades,
  });

  return json<ActionData>({ succes: true });
}

export default function EditBBQAttendance() {
  const { bbq, attendee } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const upgrades = mapUpgradesToPickItems(bbq.upgrades);
  const chosenUpgrades = mapUpgradesToPickItems(attendee.chosenUpgrades);

  return (
    <>
      <Navigation />

      <MainLayout>
        {actionData?.succes ? (
          <>
            <h1 className="font-handwriting text-7xl">Gelukt!</h1>
            <p className="my-14 w-1/2 text-2xl">
              Je wijzigingen zijn opgeslagen, en wij zijn gealarmeerd. We zijn
              dus op de hoogte!
            </p>
            <Link to={`/bbq/${bbq.slug}`}>Terug naar de BBQ</Link>
          </>
        ) : (
          <>
            <h1 className="font-handwriting text-7xl">
              Bewerk je aanwezigheid voor {bbq.title}
            </h1>

            <Form className="mt-6 space-y-6" method="post">
              <Label label="Wat neem je mee (optioneel)?" stacked>
                <TextInput
                  name="brings"
                  multiline
                  defaultValue={attendee.brings as string}
                />
              </Label>

              {bbq.proposedDates.length > 0 ? (
                <>
                  <h2>Op welke datums zou je kunnen?</h2>
                  <DatePicker
                    name="attendance-dates"
                    dates={bbq.proposedDates}
                    defaultCheckedDates={attendee.availableDates}
                  />
                  {actionData?.errors?.dates ? (
                    <ErrorMessage id="" message={actionData.errors.dates} />
                  ) : null}
                </>
              ) : null}

              {bbq.upgrades.length > 0 ? (
                <div className="space-y-2">
                  <h2>Wil je een upgrade?</h2>
                  <PickList
                    name="upgrades"
                    items={upgrades}
                    defaultCheckedItems={chosenUpgrades}
                  />
                  <p className="text-sm italic">
                    Upgrades af te rekenen bij de BBQ met geld of dansjes.
                  </p>
                </div>
              ) : null}

              <Button variant="primary" type="submit">
                Opslaan
              </Button>
            </Form>
          </>
        )}
      </MainLayout>
    </>
  );
}
