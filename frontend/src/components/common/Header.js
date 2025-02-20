import XSvg from "../svgs/X.js";

export const Header = () => {
  return (
    <header className="sticky top-0 z-[1] mx-auto flex w-full max-w-7xl items-center justify-center border-b border-gray-100 bg-background p-[1em] font-sans font-bold uppercase text-text-primary backdrop-blur-[100px] dark:border-gray-800 dark:bg-d-background dark:text-d-text-primary">
      <XSvg className="h-12 w-auto" />
    </header>
  );
};

export default Header;
