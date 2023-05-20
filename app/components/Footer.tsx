export default function Footer() {
  return (
    <div className="mt-auto">
      <footer className="flex flex-row items-center justify-between border-t-2 border-t-cyan-100 bg-cyan-50 px-10 py-5">
        <p className="mx-auto">© KasKady {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
