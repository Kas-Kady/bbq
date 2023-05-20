type Props = {
  message: string;
};

export default function SuccessMessage({ message }: Props) {
  return (
    <p className="mt-2.5 w-full border-2 border-emerald-200 bg-emerald-100 px-8 py-4 text-emerald-500">
      {message}
    </p>
  );
}
