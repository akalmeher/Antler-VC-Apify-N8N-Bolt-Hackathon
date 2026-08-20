const LOCKUP_SRC = '/mrror-logo+icon.svg';
const ICON_SRC = '/mrror-icon.svg';

export function BrandLockup({
  variant = 'full',
}: {
  variant?: 'full' | 'responsive';
}) {
  if (variant === 'responsive') {
    return (
      <>
        <img
          src={LOCKUP_SRC}
          alt="m.rror"
          className="hidden h-8 w-auto lg:block"
        />
        <img
          src={ICON_SRC}
          alt="m.rror"
          className="h-8 w-auto lg:hidden"
        />
      </>
    );
  }

  return (
    <img
      src={LOCKUP_SRC}
      alt="m.rror"
      className="h-11 w-auto sm:h-12"
    />
  );
}

export function BrandIcon({
  className = 'h-8',
}: {
  className?: string;
}) {
  return <img src={ICON_SRC} alt="m.rror" className={`w-auto ${className}`} />;
}
