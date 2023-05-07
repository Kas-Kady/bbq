import React from 'react';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import {
  icon as fontAwesomeIcon,
  toHtml,
} from '@fortawesome/fontawesome-svg-core';

export type Props = {
  name: IconName;
  className?: React.HTMLAttributes<HTMLSpanElement>['className'];
  prefix?: Extract<IconPrefix, 'fas' | 'fab' | 'far'>;
  sizes?: 's' | 'm' | 'l' | 'xl' | 'full';
};

const sizeMap = new Map<Props['sizes'], string>();
sizeMap.set('s', 'fa-xs');
sizeMap.set('m', ''); // Default font-size
sizeMap.set('l', 'fa-2x');
sizeMap.set('xl', 'fa-3x');
sizeMap.set('full', 'fa-5x');

const Icon = ({ name, prefix = 'fas', className = '', sizes = 'm' }: Props) => {
  const icon = fontAwesomeIcon(
    {
      prefix,
      iconName: name,
    },
    {
      classes: [sizeMap.get(sizes) || ''],
    }
  ).abstract.shift();

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: toHtml(icon) }}
    />
  );
};

export default Icon;
