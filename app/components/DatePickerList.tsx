import type { User } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/server-runtime';
import { formatDateToLocale, formatPercentageToLocale } from '~/utils';
import Button from '~/components/Button';

type Props = {
  list: Record<string, SerializeFrom<User>[]>;
  totalAttendees: SerializeFrom<User>[];
  onPickDate: (date: string) => void;
};

export default function DatePickerList({
  list,
  totalAttendees,
  onPickDate,
}: Props) {
  return (
    <table className="w-full table-fixed border border-cyan-200">
      <thead>
        <tr className="text-left">
          <th className="border border-cyan-200 bg-cyan-50 p-2">Datum</th>
          <th className="border border-cyan-200 bg-cyan-50 p-2">Aanwezig</th>
          <th className="border border-cyan-200 bg-cyan-50 p-2">Afwezig</th>
          <th className="border border-cyan-200 bg-cyan-50 p-2">
            Populariteit
          </th>
          <th className="border border-cyan-200 bg-cyan-50 p-2"></th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(list).map(([date, users], index) => (
          <tr className={index === 0 ? 'bg-green-100' : ''} key={date}>
            <td className="border border-cyan-200 p-2">
              {formatDateToLocale(date)}
            </td>
            <td className="border border-cyan-200 p-2">
              {users.map((user) => user.name).join(', ')}
            </td>
            <td className="border border-cyan-200 p-2">
              {users.length === totalAttendees.length
                ? 'Niemand'
                : totalAttendees
                    .filter(
                      (attendee) =>
                        !users.find((user) => user.id === attendee.id),
                    )
                    .map((attendee) => attendee.name)
                    .join(', ')}
            </td>
            <td className="border border-cyan-200 p-2">
              {formatPercentageToLocale(users.length / totalAttendees.length)}
            </td>
            <td>
              <Button
                variant="primary"
                size="small"
                onClick={() => onPickDate(date)}
              >
                Kies datum
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
