import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUser } from '~/session.server';
import stylesheet from '~/tailwind.css';
import { Document } from '~/components/Document';
import { Outlet } from '@remix-run/react';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
