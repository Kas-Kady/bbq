import type { Upgrade } from '@prisma/client';
import type { BBQResponse } from '~/models/bbq.server';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import DateTimeField from '~/components/DateTimeField';
import Editor from '~/components/Editor';
import UpgradesField from '~/components/UpgradesField';
import Button from '~/components/Button';
import DatesPickerEntryField from '~/components/DatesPickerEntryField';

type Props = {
  action: string;
  bbq?: BBQResponse;
  upgrades?: Pick<Upgrade, 'description' | 'amount'>[];
};

export default function BBQForm({ action, bbq, upgrades }: Props) {
  return (
    <form action={action} method="post" className="space-y-10">
      <input hidden name="id" defaultValue={bbq?.id} />
      <div className="flex flex-col gap-4 md:flex-row md:gap-16">
        <div className="w-full">
          <Label label="Titel">
            <TextInput name="title" defaultValue={bbq?.title} />
          </Label>
        </div>

        <div className="w-auto">
          <DateTimeField
            name="datetime"
            defaultValue={bbq?.date ? new Date(bbq.date) : undefined}
          />
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-3/4 flex-none">
          <Label label="Beschrijving">
            <Editor name="description" initialValue={bbq?.description} />
          </Label>
        </div>

        <div className="w-1/4 flex-none">
          <Label label="Upgrades">
            <UpgradesField name="upgrades" initialUpgrades={upgrades} />
          </Label>
        </div>
      </div>

      <div className="flex w-full flex-none justify-between gap-20">
        <div className="w-3/4">
          <Label label="Datums">
            <DatesPickerEntryField
              name="proposedDates"
              dates={bbq?.proposedDates}
            />
          </Label>
        </div>

        <div className="flex w-1/4 items-end justify-end">
          <Button variant="primary" type="submit">
            Opslaan
          </Button>
        </div>
      </div>
    </form>
  );
}
