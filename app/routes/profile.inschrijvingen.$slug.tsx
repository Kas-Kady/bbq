import { useEffect, useRef } from 'react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { User } from '@prisma/client';
import DatePickerList from '~/components/DatePickerList';
import { formatDateToLocale, getErrorMessage } from '~/utils';
import SuccessMessage from '~/components/SuccessMessage';
import ErrorMessage from '~/components/ErrorMessage';
import { getBBQ, setDateForBBQ } from '~/models/bbq.server';
import { requireAdminUser } from '~/session.server';
import { sendMailToAttendees } from '~/mail.server';

interface BaseActionData {
  success: boolean;
}

interface SuccessActionData extends BaseActionData {
  success: true;
  date: string;
  error?: never;
}

interface ErrorActionData extends BaseActionData {
  success: false;
  error: string;
  date?: never;
}

type ActionData = SuccessActionData | ErrorActionData;

export async function loader({ request, params }: LoaderArgs) {
  await requireAdminUser(request);

  const { slug } = params;
  invariant(slug, 'Expected slug to be defined');

  const bbq = await getBBQ(slug);
  invariant(bbq, 'Expected bbq to be defined');

  // Go through the attendees and make a list of the selected dates and which attendee selected them.
  // Sort the list by popularity of the dates.
  const datePickerList: Record<string, User[]> = {};
  bbq.attendees.forEach((attendee) => {
    attendee.availableDates.forEach((date) => {
      if (datePickerList[date]) {
        datePickerList[date] = [...datePickerList[date], attendee.user];
      } else {
        datePickerList[date] = [attendee.user];
      }
    });
  });

  return json({ bbq, datePickerList });
}

export async function action({ request, params }: ActionArgs) {
  await requireAdminUser(request);

  const { slug } = params;
  invariant(slug, 'Expected slug to be defined');

  const formData = await request.formData();

  const date = formData.get('date');
  invariant(date && typeof date === 'string', 'Expected date to be defined');

  try {
    const bbq = await setDateForBBQ(slug, date);
    await sendMailToAttendees(bbq);
  } catch (error) {
    console.error('error', error);
    return json<ActionData>(
      { success: false, error: getErrorMessage(error) },
      { status: 422 },
    );
  }

  return json<ActionData>({ success: true, date });
}

export default function BBQAttendanceDetailsRoute() {
  const fetcher = useFetcher();
  const { bbq, datePickerList } = useLoaderData<typeof loader>();
  let actionData = useRef<ActionData>();

  useEffect(() => {
    if (fetcher.data) {
      actionData.current = fetcher.data;
    }
  }, [fetcher]);

  useEffect(() => {
    if (!actionData.current?.success) {
      console.error(actionData.current?.error);
    }
  }, [actionData]);

  const handlePickDate = (date: string) => {
    fetcher.submit({ date }, { method: 'POST' });
  };

  return (
    <div className="space-y-6">
      {actionData?.current?.success ? (
        <SuccessMessage
          message={`Datum is ingesteld op ${formatDateToLocale(
            actionData.current.date,
          )}`}
        />
      ) : null}
      {actionData?.current?.success === false ? (
        <ErrorMessage
          id=""
          message="Er is iets misgegaan bij het instellen van de datum."
        />
      ) : null}

      <h1 className="font-handwriting text-5xl">{bbq.title}</h1>
      <p>
        Datum: {bbq.date ? formatDateToLocale(bbq.date) : 'Nog niet bekend..'}
      </p>
      <p dangerouslySetInnerHTML={{ __html: bbq.description }} />

      <h2 className="font-handwriting text-3xl">Inschrijvingen</h2>
      <table className="w-full table-fixed border border-cyan-200">
        <thead>
          <tr className="text-left">
            <th className="border border-cyan-200 bg-cyan-50 p-2">Naam</th>
            <th className="border border-cyan-200 bg-cyan-50 p-2">Neemt mee</th>
            <th className="border border-cyan-200 bg-cyan-50 p-2">Upgrades</th>
          </tr>
        </thead>

        <tbody>
          {bbq.attendees.map((attendee) => (
            <tr key={attendee.id}>
              <td className="border border-cyan-200 p-2">
                {attendee.user.name}
              </td>
              <td className="border border-cyan-200 p-2">{attendee.brings}</td>
              <td className="border border-cyan-200 p-2">
                {attendee.chosenUpgrades
                  .map((upgrade) => upgrade.description)
                  .join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="font-handwriting text-3xl">Datum prikker</h2>
      <DatePickerList
        list={datePickerList}
        totalAttendees={bbq.attendees.map((attendee) => attendee.user)}
        onPickDate={handlePickDate}
      />
    </div>
  );
}
