import type { PickListItem } from '~/components/PickList';
import PickList from '~/components/PickList';
import { formatDateToLocale } from '~/utils';

type Props = {
  name: string;
  dates: string[];
  defaultCheckedDates?: string[];
};

export default function DatePicker({
  name,
  dates,
  defaultCheckedDates = [],
}: Props) {
  const items: PickListItem[] = dates.map((date) => ({
    label: formatDateToLocale(date),
    value: date,
  }));

  const checkedItems: PickListItem[] = defaultCheckedDates.map((date) => ({
    label: formatDateToLocale(date),
    value: date,
  }));

  return (
    <PickList name={name} items={items} defaultCheckedItems={checkedItems} />
  );
}
