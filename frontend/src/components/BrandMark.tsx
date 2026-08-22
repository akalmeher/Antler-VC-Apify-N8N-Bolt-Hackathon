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

export function BrandSweepIcon({
  className = 'h-14',
  active = true,
}: {
  className?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex overflow-hidden ${
        active ? 'animate-pulse-soft motion-reduce:animate-none' : ''
      }`}
    >
      <BrandIcon className={className} />
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
        >
          <span className="absolute inset-y-[-10%] left-0 w-[42%] bg-gradient-to-r from-transparent via-surface to-transparent opacity-80 animate-gloss-sweep" />
        </span>
      )}
    </div>
  );
}
