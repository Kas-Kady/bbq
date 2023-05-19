import { useState } from 'react';
import Label from '~/components/Label';
import Checkbox from '~/components/Checkbox';

export type PickListItem = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  items: PickListItem[];
  defaultCheckedItems?: PickListItem[];
};

export default function PickList({
  name,
  items,
  defaultCheckedItems = [],
}: Props) {
  const [checkedItemsList, setCheckedItemsList] = useState(defaultCheckedItems);

  const handleCheckboxChange = (add: boolean, item: PickListItem) => {
    if (add) {
      setCheckedItemsList([...checkedItemsList, item]);
      return;
    }

    setCheckedItemsList(checkedItemsList.filter((d) => d !== item));
  };

  const checkedItems = checkedItemsList.map((item) => item.value).join(',');

  return (
    <>
      <input type="hidden" name={name} value={checkedItems} />
      <ul className="space-y-2">
        {items.map((item) => (
          <PickerItem
            key={item.value}
            item={item}
            defaultChecked={checkedItemsList?.includes(item)}
            onCheckChange={handleCheckboxChange}
          />
        ))}
      </ul>
    </>
  );
}

type PickerItemProps = {
  item: PickListItem;
  defaultChecked?: boolean;
  onCheckChange: (add: boolean, item: PickListItem) => void;
};

function PickerItem({ item, defaultChecked, onCheckChange }: PickerItemProps) {
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
        label={item.label}
        stacked={false}
      >
        <Checkbox
          color="text-green-heavy"
          defaultChecked={defaultChecked}
          onChange={(event) => onCheckChange(event.target.checked, item)}
        />
      </Label>
    </li>
  );
}
