import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';
import BBQForm from '~/components/BBQForm';

export default function NewBBQRoute() {
  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">Nieuwe BBQ</h1>

        <BBQForm action="/api/bbq" />
      </MainLayout>
    </>
  );
}
