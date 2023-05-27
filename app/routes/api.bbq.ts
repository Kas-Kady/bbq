import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { isDefined } from '~/validations';
import slugify from '@sindresorhus/slugify';
import type { Upgrade } from '~/models/bbq.server';
import { createBBQ, updateBBQ } from '~/models/bbq.server';
import invariant from 'tiny-invariant';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const id = formData.get('id');
  const title = formData.get('title');
  const datetime = formData.get('datetime');
  const proposedDates = formData.get('proposedDates');
  const description = formData.get('description');
  const stringifiedUpgrades = formData.get('upgrades');

  isDefined(title);
  isDefined(description);
  isDefined(stringifiedUpgrades);

  const upgrades = JSON.parse(stringifiedUpgrades) as Upgrade[];
  const slug = slugify(title);

  let bbqDateTime: Date | undefined;
  let bbqProposedDates: string[] | undefined;

  if (datetime !== null && typeof datetime === 'string') {
    bbqDateTime = new Date(datetime);
  }

  if (proposedDates !== null && typeof proposedDates === 'string') {
    bbqProposedDates = JSON.parse(proposedDates) as string[];
  }

  if (id) {
    invariant(typeof id === 'string', 'id must be a string');

    try {
      await updateBBQ({
        id,
        slug,
        title,
        description,
        datetime: bbqDateTime,
        proposedDates: bbqProposedDates,
        upgrades,
      });
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update BBQ');
    }
  } else {
    try {
      await createBBQ({
        slug,
        title,
        description,
        datetime: bbqDateTime,
        proposedDates: bbqProposedDates,
        upgrades,
      });
    } catch (err) {
      console.error(err);
      throw new Error('Failed to create BBQ');
    }
  }

  return redirect(`/bbq/${slug}`);
}

export default function BBQAPIRoute() {
  return null;
}
