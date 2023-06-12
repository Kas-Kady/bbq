import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireAdminUser } from '~/session.server';
import { getBBQsWithAttendeeCount } from '~/models/bbq.server';
import Anchor from '~/components/Anchor';

export async function loader({ request }: LoaderArgs) {
  await requireAdminUser(request);

  const bbqs = await getBBQsWithAttendeeCount();
  const bbqsWithAttendees = bbqs.filter((bbq) => bbq.attendees.length > 0);
  const bbqsWithoutAttendees = bbqs.filter((bbq) => bbq.attendees.length === 0);

  return json({ bbqsWithAttendees, bbqsWithoutAttendees });
}

export default function AttendancesRoute() {
  const { bbqsWithAttendees, bbqsWithoutAttendees } =
    useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-5xl">Inschrijvingen</h1>
      <p>Hier kunnen we zien welke BBQ's al inschrijvingen hebben.</p>

      <h2 className="font-handwriting text-3xl">BBQ's met inschrijvingen</h2>
      <ul className="list-inside list-disc marker:text-cyan-400">
        {bbqsWithAttendees.map((bbq) => (
          <li key={bbq.id}>
            <Anchor
              className="font-bold"
              to={`/profile/inschrijvingen/${bbq.slug}`}
            >
              {bbq.title}
            </Anchor>{' '}
            ({bbq.attendees.length} inschrijvingen)
          </li>
        ))}
      </ul>

      <h2 className="font-handwriting text-3xl">BBQ's zonder inschrijvingen</h2>
      <ul className="list-inside list-disc marker:text-cyan-400">
        {bbqsWithoutAttendees.map((bbq) => (
          <li key={bbq.id}>
            <span className="font-bold">{bbq.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
