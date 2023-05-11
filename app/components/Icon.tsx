import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { icon, library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheck,
  faFileLines,
  faTrashAlt,
  faStroopwafel,
  faChevronUp,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCircleXmark,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';

library.add(
  faCheck,
  faFileLines,
  faTrashAlt,
  faStroopwafel,
  faCircleXmark,
  faPenToSquare,
  faChevronUp,
  faChevronDown,
);

type Props = {
  name: IconName;
  prefix?: IconPrefix;
  spin?: boolean;
};

const Icon = ({ name, prefix = 'fas', spin = false }: Props) => {
  const classes = [];

  if (spin) {
    classes.push('fa-spin');
  }

  const iconHTML = icon(
    {
      prefix,
      iconName: name,
    },
    {
      classes,
      styles: {
        height: '1em',
      },
    },
  ).html;

  return <span dangerouslySetInnerHTML={{ __html: iconHTML[0] }} />;
};

export default Icon;
