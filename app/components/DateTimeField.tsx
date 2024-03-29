import Label from '~/components/Label';
import { Select, SelectItem } from '~/components/Select';
import NumberInput from '~/components/NumberInput';
import { constructDate, formatDateParts } from '~/utils';
import { useEffect, useRef, useState } from 'react';

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

type BaseProps = {
  name: string;
};

type ControlledProps = BaseProps & {
  value?: Date;
  onChange?: (value: Date) => void;
  defaultValue?: never;
};

type UncontrolledProps = BaseProps & {
  defaultValue?: Date;
  onChange?: never;
  value?: never;
};

type Props = ControlledProps | UncontrolledProps;

export default function DateTimeField({ name, ...props }: Props) {
  const { value, onChange } = props as ControlledProps;
  const { defaultValue } = props as UncontrolledProps;

  const defaultDate = defaultValue || value || new Date();
  const { day, month, year, hour, minute } = formatDateParts(defaultDate);

  const [dayValue, setDayValue] = useState(day);
  const [monthValue, setMonthValue] = useState(month);
  const [yearValue, setYearValue] = useState(year);
  const [hourValue, setHourValue] = useState(hour);
  const [minuteValue, setMinuteValue] = useState(minute);
  const changeCallbackShouldBeCalled = useRef(false);

  let date = defaultDate.toISOString();

  const handleChange = (value: string, setter: (value: string) => void) => {
    setter(value);

    if (onChange) {
      changeCallbackShouldBeCalled.current = true;
    }
  };

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

  useEffect(() => {
    if (changeCallbackShouldBeCalled.current && onChange) {
      onChange(
        new Date(
          parseInt(yearValue),
          parseInt(monthValue) - 1,
          parseInt(dayValue),
          parseInt(hourValue),
          parseInt(minuteValue),
        ),
      );
      changeCallbackShouldBeCalled.current = false;
    }
  });

  return (
    <div className="flex flex-1 flex-col gap-5 lg:flex-row">
      {defaultValue ? <input type="hidden" name={name} value={date} /> : null}

      <div className="flex flex-row gap-5">
        <Label className="flex-none text-gray-500" label="Dag" width="w-auto">
          <Select
            value={dayValue}
            onValueChange={(value) => handleChange(value, setDayValue)}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </Select>
        </Label>

        <Label className="flex-none text-gray-500" width="w-auto" label="Maand">
          <Select
            className="w-full flex-none lg:w-40"
            value={monthValue}
            onValueChange={(value) => handleChange(value, setMonthValue)}
          >
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.name}
              </SelectItem>
            ))}
          </Select>
        </Label>

        <Label className="text-gray-500" width="w-24" label="Jaar">
          <NumberInput
            name="year"
            className="form-input flex-none appearance-none text-xl"
            value={yearValue}
            onChange={(event) => handleChange(event.target.value, setYearValue)}
          />
        </Label>
      </div>

      <div className="flex flex-row items-end gap-3">
        <Label className="text-gray-500" width="w-14" label="Tijd">
          <NumberInput
            name="hour"
            className="form-input appearance-none text-xl"
            value={hourValue}
            onChange={(event) => handleChange(event.target.value, setHourValue)}
          />
        </Label>

        <p className="mb-1 text-3xl text-gray-500">:</p>

        <Label className="text-gray-500" width="w-14" label="">
          <NumberInput
            name="minute"
            className="form-input appearance-none text-xl"
            value={minuteValue}
            onChange={(event) =>
              handleChange(event.target.value, setMinuteValue)
            }
          />
        </Label>
      </div>
    </div>
  );
}
