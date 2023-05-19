type Props = {
  id: string;
  message: string;
};

export default function ErrorMessage({ id, message }: Props) {
  return (
    <p
      id={id}
      className="mt-2.5 w-full border-2 border-red-200 bg-red-100 px-8 py-4 text-red-500"
    >
      {message}
    </p>
  );
}
