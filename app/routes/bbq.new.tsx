import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import slugify from '@sindresorhus/slugify';
import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import Editor from '~/components/Editor';
import DateTimeField from '~/components/DateTimeField';
import UpgradesField from '~/components/UpgradesField';
import Button from '~/components/Button';
import { isDefined } from '~/validations';
import type { Upgrade } from '~/types/Upgrade';
import { createBBQ } from '~/models/bbq.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get('title');
  const datetime = formData.get('datetime');
  const description = formData.get('description');
  const stringifiedUpgrades = formData.get('upgrades');

  isDefined(title);
  isDefined(datetime);
  isDefined(description);
  isDefined(stringifiedUpgrades);

  const upgrades = JSON.parse(stringifiedUpgrades) as Upgrade[];
  const bbqDateTime = new Date(datetime);
  const slug = slugify(title);

  await createBBQ({
    slug,
    title,
    description,
    datetime: bbqDateTime,
    upgrades,
  });

  return redirect(`/bbq/${slug}`);
}

export default function NewBBQRoute() {
  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">Nieuwe BBQ</h1>

        <form method="post" className="space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            <div className="w-full">
              <Label label="Titel">
                <TextInput name="title" />
              </Label>
            </div>

            <div className="w-auto">
              <DateTimeField name="datetime" />
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <div className="w-3/4 flex-none">
              <Label label="Beschrijving">
                <Editor name="description" />
              </Label>
            </div>

            <div className="w-1/4 flex-none">
              <Label label="Upgrades">
                <UpgradesField name="upgrades" />
              </Label>
            </div>
          </div>

          <div className="w-1/4 flex-none items-end">
            <Button variant="primary" type="submit">
              Opslaan
            </Button>
          </div>
        </form>
      </MainLayout>
    </>
  );
}
