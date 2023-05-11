import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import type { SelectItemProps, SelectProps } from '@radix-ui/react-select';
import Icon from '~/components/Icon';

type Props = SelectProps & {
  children: React.ReactNode;
  className?: string;
};

export const Select = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          className={`${className} form-input inline-flex w-full justify-between gap-5 px-5 text-xl focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`}
          ref={forwardedRef}
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <Icon name="chevron-down" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="z-10 my-8 w-full overflow-hidden bg-white shadow-md">
            <SelectPrimitive.ScrollUpButton className="py-2 text-center text-gray-500">
              <Icon name="chevron-up" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="py-2 text-center text-gray-500">
              <Icon name="chevron-down" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);
Select.displayName = 'Select';

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  Props & SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      ref={forwardedRef}
      className={`${className} flex cursor-pointer items-center justify-between gap-2 py-2 pl-12 pr-4 text-xl text-gray-500 outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100`}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute left-4">
        <Icon name="check" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = 'SelectItem';
