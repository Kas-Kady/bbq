import { useState } from 'react';
import DateTimeField from '~/components/DateTimeField';
import Button from '~/components/Button';
import Icon from '~/components/Icon';
import { formatDateToLocale } from '~/utils';

type Props = {
  name: string;
  dates?: string[];
};

export default function DatesPickerEntryField({ name, dates = [] }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [datesList, setDatesList] = useState<Date[]>(
    dates.map((d) => new Date(d)),
  );

  const stringifiedDates = JSON.stringify(
    datesList.map((d) => d.toISOString()),
  );

  const handleItemDelete = (date: Date) => {
    const index = datesList.findIndex(
      (d) => d.toISOString() === date.toISOString(),
    );

    if (index > -1) {
      const updatedDates = [...datesList];
      updatedDates.splice(index, 1);

      setDatesList(updatedDates);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:gap-16">
      <input type="hidden" name={name} value={stringifiedDates} />

      <div className="flex flex-col gap-3">
        <DateTimeField
          name=""
          value={date}
          onChange={(selectedDate) => setDate(selectedDate)}
        />
        <Button
          variant="normal"
          type="button"
          onClick={() => {
            if (date) {
              const dateAlreadyInList = datesList.some((d) =>
                d.toISOString().includes(date.toISOString()),
              );

              if (!dateAlreadyInList) {
                setDatesList([...datesList, date]);
              }
            }
          }}
        >
          Datum toevoegen
        </Button>
      </div>

      <DatesTable dates={datesList} onDeleteDate={handleItemDelete} />
    </div>
  );
}

type DatesTableProps = {
  dates: Date[];
  onDeleteDate: (date: Date) => void;
};

function DatesTable({ dates = [], onDeleteDate }: DatesTableProps) {
  return (
    <div className="flex w-full flex-col">
      <p className="font-bold">Datums</p>

      <ul>
        {dates.map((date, index) => (
          <li key={index} className="flex flex-row justify-between gap-2">
            <span>{formatDateToLocale(date)}</span>
            <button type="button" onClick={() => onDeleteDate(date)}>
              <Icon name="trash-alt" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
