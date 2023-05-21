import Input from './Input';

type SingleLineTextInputProps = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  multiline?: false;
};

type MultiLineTextInputProps = JSX.IntrinsicElements['textarea'] & {
  multiline?: true;
};

type Props = SingleLineTextInputProps | MultiLineTextInputProps;

export default function TextInput({ multiline = false, ...props }: Props) {
  if (multiline) {
    props = props as MultiLineTextInputProps;
    return (
      <textarea
        className={`${props.className} w-full focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`}
        name={props.name}
        {...props}
      />
    );
  }
  props = props as SingleLineTextInputProps;
  return <Input type="text" {...props} />;
}
