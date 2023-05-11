import type { Upgrade } from '~/types/Upgrade';
import TextInput from '~/components/TextInput';
import type { LabelProps } from '~/components/Label';
import Label from '~/components/Label';
import NumberInput from '~/components/NumberInput';
import Button from '~/components/Button';
import { useState } from 'react';
import Icon from '~/components/Icon';

type Props = {
  name: string;
  upgrades?: Upgrade[];
};

export default function Upgrades({ name }: Props) {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);

  const handleItemDelete = (upgrade: Upgrade) => {
    const index = upgrades.findIndex(
      (u) =>
        u.description === upgrade.description && u.amount === upgrade.amount,
    );

    if (index > -1) {
      const updatedUpgrades = [...upgrades];
      updatedUpgrades.splice(index, 1);

      setUpgrades(updatedUpgrades);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <input type="hidden" name={name} value={JSON.stringify(upgrades)} />
      <UpgradeField
        onChange={(upgrade) =>
          setUpgrades((upgrades) => [...upgrades, upgrade])
        }
      />

      {upgrades.length > 0 ? (
        <UpgradesTable upgrades={upgrades} onDeleteItem={handleItemDelete} />
      ) : null}
    </div>
  );
}

function UpgradeField({ onChange }: { onChange: (upgrade: Upgrade) => void }) {
  const [description, setDescription] = useState<string>();
  const [amount, setAmount] = useState<number>();

  const addUpgrade = () => {
    if (!description || !amount) {
      return;
    }

    onChange({ description, amount });
    setDescription('');
    setAmount(0);
  };

  return (
    <>
      <div className="flex flex-row gap-4">
        <UpgradeLabel label="Wat voor upgrade">
          <TextInput
            defaultValue={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </UpgradeLabel>

        <UpgradeLabel label="Hoeveel 'kost' de upgrade?">
          <NumberInput
            defaultValue={amount}
            onChange={(event) => setAmount(event.target.valueAsNumber)}
          />
        </UpgradeLabel>
      </div>

      <Button type="button" onClick={addUpgrade}>
        Upgrade toevoegen
      </Button>
    </>
  );
}

function UpgradeLabel({
  label,
  children,
}: Pick<LabelProps, 'label' | 'children'>) {
  return (
    <Label className="text-sm text-gray-500" label={label} stacked>
      {children}
    </Label>
  );
}

function UpgradesTable({
  upgrades,
  onDeleteItem,
}: {
  upgrades: Upgrade[];
  onDeleteItem: (upgrade: Upgrade) => void;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left">Upgrades</th>
          <th className="text-right">Prijs</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {upgrades.map((upgrade, index) => (
          <tr key={index}>
            <td>{upgrade.description}</td>
            <td className="text-right">€ {upgrade.amount}</td>
            <td>
              <button
                className="px-2"
                type="button"
                onClick={() => onDeleteItem(upgrade)}
              >
                <Icon name="trash-alt" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
