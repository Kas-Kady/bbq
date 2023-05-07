type Props = Omit<JSX.IntrinsicElements['input'], 'type'>;

export default function HoneyPotField({ className, ...props }: Props) {
  return (
    <input
      name="emailfield"
      className="hidden"
      type="text"
      {...props}
    />
  );
}
