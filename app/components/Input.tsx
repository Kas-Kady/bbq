type Props = JSX.IntrinsicElements['input'];

export default function TextInput({ className, ...props }: Props) {
  return (
    <input
      className={`${className} w-full focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2`}
      {...props}
    />
  );
}
