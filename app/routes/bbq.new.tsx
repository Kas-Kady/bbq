import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';
import Label from '~/components/Label';
import TextInput from '~/components/TextInput';
import Editor from '~/components/Editor';
import DateTimeField from '~/components/DateTimeField';

export default function NewBBQRoute() {
  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">Nieuwe BBQ</h1>

        <form className="space-y-10" action="">
          <div className="flex flex-row gap-16">
            <Label className="w-1/2" label="Titel">
              <TextInput name="title" />
            </Label>

            <div className="w-1/2 flex-1">
              <DateTimeField name="date" />
            </div>
          </div>

          <Label label="Beschrijving">
            <Editor name="description" />
          </Label>
        </form>
      </MainLayout>
    </>
  );
}
