import Input from './Input';

type Props = Omit<JSX.IntrinsicElements['input'], 'type'>;

export default function NumberInput({ className = '', ...props }: Props) {
  return <Input className={className} type="number" {...props} />;
}
