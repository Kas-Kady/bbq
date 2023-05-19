type Props = {
  name?: string;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  color?: string;
};

export default function Checkbox({
  name,
  defaultChecked,
  onChange,
  color = 'text-primary-heavy',
}: Props) {
  return (
    <input
      type="checkbox"
      className={`form-checkbox h-5 w-5 ${color} focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
      name={name}
      defaultChecked={defaultChecked}
      onChange={onChange}
    />
  );
}
