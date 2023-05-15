import { cssBundleHref } from '@remix-run/css-bundle';
import type { LinksFunction, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';

import { getUser } from '~/session.server';
import stylesheet from '~/tailwind.css';
import { Document } from '~/components/Document';
import { isRouteErrorResponse, Outlet, useRouteError } from '@remix-run/react';
import { getErrorMessage } from '~/utils';
import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.error(error);

    return (
      <Document>
        <Navigation />

        <div className="flex h-full items-center justify-center">
          <div className="space-y-4">
            <h1 className="text-5xl">Oeps...</h1>
            <p className="text-2xl">
              Er is iets misgegaan bij het versturen van het formulier.
            </p>
            <pre className="mt-10 w-full bg-black px-10 py-5 text-white">
              {error.status}: {error.statusText}
              <br />
              {error.data}
            </pre>
          </div>
        </div>
      </Document>
    );
  }

  const message = getErrorMessage(error);

  return (
    <Document>
      <Navigation />
      <div className="flex h-full items-center justify-center">
        <div className="max-w-screen-xl space-y-4 p-8">
          <h1 className="font-handwriting text-7xl">Aiaiai...</h1>
          <p>
            Er is iets fout gegaan op deze pagina. Probeer het later nog eens of
            laat het ons even weten..
          </p>
          <pre className="mt-10 w-full whitespace-pre-line bg-black px-10 py-5 text-white">
            {message}
          </pre>
        </div>
      </div>
    </Document>
  );
}
