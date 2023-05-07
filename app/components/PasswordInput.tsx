import Input from './Input';

type Props = Omit<JSX.IntrinsicElements['input'], 'type'>;

export default function PasswordInput({ className, ...props }: Props) {
  return (
    <Input
      type="password"
      {...props}
    />
  );
}
