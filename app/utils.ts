import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';

import type { User } from '~/models/user.server';

const DEFAULT_REDIRECT = '/';

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== 'string') {
    return defaultRedirect;
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.email === 'string';
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.',
    );
  }
  return maybeUser;
}

export function formatDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const [
    { value: day },
    ,
    { value: month },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
  ] = formatter.formatToParts(date);

  return { day, month, year, hour, minute };
}

export function constructDate({
  day,
  month,
  year,
  hour,
  minute,
}: {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
}): string {
  const date = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1, // month is 1-indexed, so we need to subtract 1
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10),
  );

  if (isNaN(date.getTime())) {
    throw new Error(
      `Invalid date for values ${day}, ${month}, ${year}, ${hour}, ${minute}`,
    );
  }

  return date.toISOString();
}

export function formatDateToLocale(date: Date | string) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };

  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (new Date().getFullYear() !== dateObj.getFullYear()) {
    options.year = 'numeric';
  }

  return new Intl.DateTimeFormat('nl-NL', options).format(dateObj);
}

export function getErrorMessage(err: unknown) {
  // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
  let message;
  if (err instanceof Error) message = err.message;
  else message = String(err);

  return message;
}
