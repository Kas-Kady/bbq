import TextInput from '~/components/TextInput';
import Label from '~/components/Label';

type Props = Pick<JSX.IntrinsicElements['input'], 'value'>;

export default function NameField({ value }: Props) {
  return (
    <Label label="Naam/Namen">
      <TextInput name="name" defaultValue={value} />
    </Label>
  );
}
