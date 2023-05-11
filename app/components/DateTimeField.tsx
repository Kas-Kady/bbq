import Label from '~/components/Label';
import { Select, SelectItem } from '~/components/Select';
import NumberInput from '~/components/NumberInput';
import { constructDate, formatDateParts } from '~/utils';
import { useState } from 'react';

type Props = {
  name: string;
  defaultValue?: Date;
};

const months = [
  { name: 'Januari', value: '01' },
  { name: 'Februari', value: '02' },
  { name: 'Maart', value: '03' },
  { name: 'April', value: '04' },
  { name: 'Mei', value: '05' },
  { name: 'Juni', value: '06' },
  { name: 'Juli', value: '07' },
  { name: 'Augustus', value: '08' },
  { name: 'September', value: '09' },
  { name: 'Oktober', value: '10' },
  { name: 'November', value: '11' },
  { name: 'December', value: '12' },
];

export default function DateTimeField({ name, defaultValue }: Props) {
  const defaultDate = defaultValue || new Date();
  const { day, month, year, hour, minute } = formatDateParts(defaultDate);

  const [dayValue, setDayValue] = useState(day);
  const [monthValue, setMonthValue] = useState(month);
  const [yearValue, setYearValue] = useState(year);
  const [hourValue, setHourValue] = useState(hour);
  const [minuteValue, setMinuteValue] = useState(minute);

  let date = defaultDate.toISOString();

  try {
    date = constructDate({
      day: dayValue,
      month: monthValue,
      year: yearValue,
      hour: hourValue,
      minute: minuteValue,
    });
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-1 flex-row gap-5">
      <input type="hidden" name={name} value={date} />

      <div className="flex flex-row gap-5">
        <Label className="text-gray-500" label="Dag">
          <Select
            value={dayValue}
            onValueChange={(value) => setDayValue(value)}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </Select>
        </Label>

        <Label className="text-gray-500" label="Maand">
          <Select
            value={monthValue}
            onValueChange={(value) => setMonthValue(value)}
          >
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.name}
              </SelectItem>
            ))}
          </Select>
        </Label>

        <Label className="text-gray-500" label="Jaar">
          <NumberInput
            name="year"
            className="form-input appearance-none text-xl"
            value={yearValue}
            onChange={(event) => setYearValue(event.target.value)}
          />
        </Label>
      </div>

      <div className="flex w-48 flex-row items-end gap-3">
        <Label className="text-gray-500" label="Tijd">
          <NumberInput
            name="hour"
            className="form-input appearance-none text-xl"
            value={hourValue}
            onChange={(event) => setHourValue(event.target.value)}
          />
        </Label>

        <p className="mb-1 text-3xl text-gray-500">:</p>

        <Label className="text-gray-500" label="">
          <NumberInput
            name="minute"
            className="form-input appearance-none text-xl"
            value={minuteValue}
            onChange={(event) => setMinuteValue(event.target.value)}
          />
        </Label>
      </div>
    </div>
  );
}
