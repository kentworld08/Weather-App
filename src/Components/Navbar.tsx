export const Navbar = () => {
  return (
    <header className="fixed top-0 right-0 left-0 bg-white shadow-2xl px-5 z-10">
      <nav className="flex justify-between items-center h-10">
        <div className="flex items-center gap-2">
          <img src="/image.png" alt="" width={20} height={20} loading="lazy" />
          <h1 className="font-medium">Weather</h1>
        </div>
      </nav>
    </header>
  );
};
