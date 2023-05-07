type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <p className="mt-2.5 border-2 border-red-200 bg-red-100 px-8 py-4 text-red-500">
      {message}
    </p>
  );
}
