import Input from './Input';

type Props = Omit<JSX.IntrinsicElements['input'], 'type'>;

export default function EmailInput({ ...props }: Props) {
  return <Input type="email" {...props} />;
}
