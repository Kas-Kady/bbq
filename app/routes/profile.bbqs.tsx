import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { getBBQsForUser } from '~/models/bbq.server';
import { Link, useLoaderData } from '@remix-run/react';
import Anchor from '~/components/Anchor';

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const bbqs = await getBBQsForUser(userId);

  return json({ bbqs });
}

export default function ProfileBBQRoute() {
  const { bbqs } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-7xl">
        BBQ's waar ik op ben ingeschreven
      </h1>

      {bbqs.length === 0 ? (
        <p className="text-2xl">
          Je hebt nog geen BBQ's gepland. Kijk even op de{' '}
          <Anchor to="/">BBQ pagina</Anchor> om er eentje te vinden waar je aan
          deel wilt nemen.
        </p>
      ) : (
        <ul className="list-inside list-disc marker:text-cyan-400">
          {bbqs.map((bbq) => (
            <li key={bbq.id}>
              <Link to={`/bbq/${bbq.slug}`}>{bbq.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
