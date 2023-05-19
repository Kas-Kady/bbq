import { formatDateToLocale } from '~/utils';
import Checkbox from '~/components/Checkbox';
import Label from '~/components/Label';
import { useState } from 'react';

type Props = {
  name: string;
  dates: string[];
  defaultCheckedDates?: string[];
};

export default function DatePicker({ dates, defaultCheckedDates = [] }: Props) {
  const [checkedDatesList, setCheckedDatesList] =
    useState<string[]>(defaultCheckedDates);

  const handleCheckboxChange = (add: boolean, date: string) => {
    if (add) {
      setCheckedDatesList([...checkedDatesList, date]);
      return;
    }

    setCheckedDatesList(checkedDatesList.filter((d) => d !== date));
  };

  return (
    <>
      <input type="hidden" name="dates" value={checkedDatesList.join(',')} />
      <ul className="space-y-2">
        {dates.map((date) => (
          <PickerItem
            key={date}
            date={date}
            defaultChecked={checkedDatesList?.includes(date)}
            onDateChange={handleCheckboxChange}
          />
        ))}
      </ul>
    </>
  );
}

type PickerItemProps = {
  date: string;
  defaultChecked?: boolean;
  onDateChange: (add: boolean, date: string) => void;
};

function PickerItem({ date, defaultChecked, onDateChange }: PickerItemProps) {
  return (
    <li
      className={`cursor-pointer gap-5 border-2 transition
         ${
           defaultChecked
             ? 'border-green-heavy bg-green-light hover:bg-green'
             : 'border-primary bg-transparent hover:bg-primary-light'
         }
        `}
    >
      <Label
        className="cursor-pointer justify-between px-4 pt-2"
        label={formatDateToLocale(date)}
        stacked={false}
      >
        <Checkbox
          name={date}
          color="text-green-heavy"
          defaultChecked={defaultChecked}
          onChange={(event) => onDateChange(event.target.checked, date)}
        />
      </Label>
    </li>
  );
}
