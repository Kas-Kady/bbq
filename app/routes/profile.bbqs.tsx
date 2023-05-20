import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import { getBBQsForUser } from '~/models/bbq.server';
import { Link, useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const bbqs = await getBBQsForUser(userId);

  return json({ bbqs });
}

export default function ProfileBBQRoute() {
  const { bbqs } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h1 className="font-handwriting text-7xl">Mijn BBQ's</h1>

      <ul>
        {bbqs.map((bbq) => (
          <li key={bbq.id}>
            <Link to={`/bbq/${bbq.slug}`}>{bbq.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
