const LOCKUP_SRC = '/mrror-logo+icon.svg';
const ICON_SRC = '/mrror-icon.svg';

export function BrandLockup() {
  return (
    <img
      src={LOCKUP_SRC}
      alt="m.rror"
      className="h-8 w-auto sm:h-9"
    />
  );
}

export function BrandIcon({
  className = 'h-9',
}: {
  className?: string;
}) {
  return <img src={ICON_SRC} alt="m.rror" className={`w-auto ${className}`} />;
}
