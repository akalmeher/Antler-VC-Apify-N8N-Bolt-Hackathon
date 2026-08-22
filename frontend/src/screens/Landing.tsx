import { BrandLockup } from '@/components/BrandMark';
import { Reveal } from '@/components/Reveal';
import { Eye, Radar, ListChecks, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Tell us about your business',
    body: 'What you sell, where you are, and roughly what you charge. That context is what turns a competitor’s move into advice meant for you.',
  },
  {
    n: '02',
    title: 'Choose the competitors that matter',
    body: 'Point m.rror at the pages that actually move: pricing, offerings, promotions. We monitor from the cloud, on a schedule, without you babysitting tabs.',
  },
  {
    n: '03',
    title: 'm.rror monitors what changes',
    body: 'Each check is compared against the last snapshot. Cosmetic noise is ignored. Real movement, like a new price, offer, or day-part, becomes a signal.',
  },
  {
    n: '04',
    title: 'Get a clear recommendation',
    body: 'An analyst-style brief: what they did, why it matters against your own offering, and a concrete move you can try this week.',
  },
];

const EXAMPLES = [
  {
    tone: 'change' as const,
    kicker: 'New change / promotion',
    title: 'They launched a weekday lunch promotion',
    finding: 'A new $15 lunch bundle runs 11am-3pm, Monday through Friday, and includes a drink.',
    action: 'Test an $11.95 Tue-Thu plate plus fountain drink on the sidewalk board.',
    chart: 'promotion-window' as const,
  },
  {
    tone: 'threat' as const,
    kicker: 'Watch / pricing',
    title: 'They cut prices on their most comparable item',
    finding: 'Their signature plate dropped from $16.50 to $14.00 while yours held at $15.75.',
    action: 'Hold your price, but make the portion difference explicit on the board and online.',
    chart: 'price-change' as const,
  },
  {
    tone: 'change' as const,
    kicker: 'New change / hours',
    title: 'They extended hours into the late-night window',
    finding: 'The location now stays open until midnight Thursday through Saturday.',
    action: 'Pick one of those nights and stay open an extra hour before matching all three.',
    chart: 'late-night-days' as const,
  },
  {
    tone: 'opportunity' as const,
    kicker: 'Opportunity / offering',
    title: 'They added a new offering you already do better',
    finding: 'A breakfast item appeared on their board at $9, above your existing $7.50 version.',
    action: 'Put your breakfast item on a morning-only board and name the price out loud.',
    chart: 'offering-comparison' as const,
  },
];

const REASONS = [
  {
    title: 'Catch it before your customers do',
    body: 'A competitor’s new offer matters the morning it lands, not when a regular mentions it a week later.',
  },
  {
    title: 'Written for the person running the place',
    body: 'Short, specific, and free of raw crawl dumps. One action you can try this week.',
  },
  {
    title: 'Your prices, not generic advice',
    body: 'Every signal is compared against what you already offer. If it doesn’t touch your business, it doesn’t make the cut.',
  },
];

const FREE_PLAN_FEATURES = [
  'Discover nearby competitors',
  'Initial snapshot',
  '2 manual re-scans per month',
];

const CORE_PLAN_FEATURES = [
  '1 business location',
  'Up to 5 competitors',
  'Nearby discovery',
  'Full AI recommendations',
  'Signal history',
  'Unlimited manual re-scans',
];

const PRICING_ADD_ONS = [
  { label: '+5 competitors', price: '+$10' },
  { label: '+1 location', price: '+$20' },
  { label: 'Priority monitoring', price: '+$10' },
];

const TONE_CLASS = {
  change: 'border-semantic-warningBorder bg-semantic-warningBg text-semantic-warning',
  opportunity: 'border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity',
  threat: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
};

function SignalChart({
  kind,
}: {
  kind: 'promotion-window' | 'price-change' | 'late-night-days' | 'offering-comparison';
}) {
  if (kind === 'promotion-window') {
    return (
      <figure className="mt-4 text-charcoal">
        <figcaption className="sentinel-label mb-2 text-[11px] font-semibold text-muted">
          Weekday promotion window
        </figcaption>
        <svg
          viewBox="0 0 360 132"
          className="sentinel-chart h-auto w-full"
          role="img"
          aria-labelledby="promotion-window-title promotion-window-desc"
        >
          <title id="promotion-window-title">Weekday lunch promotion schedule</title>
          <desc id="promotion-window-desc">
            The 15 dollar lunch bundle runs from 11 in the morning to 3 in the afternoon, Monday through Friday.
          </desc>

          <line x1="30" y1="66" x2="330" y2="66" stroke="#D8D0C5" strokeWidth="1" />
          <line x1="105" y1="66" x2="205" y2="66" stroke="#7E9A7F" strokeWidth="8" strokeLinecap="round" />
          <circle cx="105" cy="66" r="6" fill="#FBF8F3" stroke="#7E9A7F" strokeWidth="2.5" />
          <circle cx="205" cy="66" r="6" fill="#7E9A7F" />

          <g className="sentinel-label fill-muted text-[11px]">
            <text x="30" y="92" textAnchor="middle">8am</text>
            <text x="105" y="92" textAnchor="middle">11am</text>
            <text x="205" y="92" textAnchor="middle">3pm</text>
            <text x="330" y="92" textAnchor="middle">8pm</text>
          </g>
          <g className="sentinel-label fill-charcoal text-[11px] font-semibold">
            <text x="155" y="45" textAnchor="middle">$15 bundle</text>
            <text x="155" y="120" textAnchor="middle">Monday-Friday</text>
          </g>
        </svg>
      </figure>
    );
  }

  if (kind === 'price-change') {
    return (
      <figure className="mt-4 text-charcoal">
        <figcaption className="sentinel-label mb-2 text-[11px] font-semibold text-muted">
          Menu price (USD)
        </figcaption>
        <svg
          viewBox="0 0 360 132"
          className="sentinel-chart h-auto w-full"
          role="img"
          aria-labelledby="price-change-title price-change-desc"
        >
          <title id="price-change-title">Competitor menu price change</title>
          <desc id="price-change-desc">
            The competitor price fell from 16 dollars and 50 cents to 14 dollars.
          </desc>

          <g className="stroke-ink-border" strokeWidth="1">
            <line x1="48" y1="20" x2="328" y2="20" />
            <line x1="48" y1="61" x2="328" y2="61" />
            <line x1="48" y1="102" x2="328" y2="102" />
          </g>
          <g className="sentinel-label fill-muted text-[11px]">
            <text x="8" y="24">$18</text>
            <text x="8" y="65">$15</text>
            <text x="8" y="106">$12</text>
          </g>

          <path d="M 104 40.5 L 272 74.7" fill="none" stroke="#AD2F2F" strokeWidth="2.5" />
          <circle cx="104" cy="40.5" r="5" fill="#FBF8F3" stroke="#AD2F2F" strokeWidth="2.5" />
          <circle cx="272" cy="74.7" r="5" fill="#AD2F2F" />

          <g className="sentinel-label fill-charcoal text-[11px] font-semibold">
            <text x="104" y="31" textAnchor="middle">$16.50</text>
            <text x="272" y="65" textAnchor="middle">$14.00</text>
          </g>
          <g className="sentinel-label fill-muted text-[11px]">
            <text x="104" y="124" textAnchor="middle">Previous</text>
            <text x="272" y="124" textAnchor="middle">Current</text>
          </g>
        </svg>
      </figure>
    );
  }

  if (kind === 'late-night-days') {
    return (
      <figure className="mt-4 text-charcoal">
        <figcaption className="sentinel-label mb-2 text-[11px] font-semibold text-muted">
          New midnight service
        </figcaption>
        <svg
          viewBox="0 0 360 132"
          className="sentinel-chart h-auto w-full"
          role="img"
          aria-labelledby="late-night-title late-night-desc"
        >
          <title id="late-night-title">Days with extended midnight service</title>
          <desc id="late-night-desc">
            The competitor now stays open until midnight on Thursday, Friday, and Saturday.
          </desc>

          <line x1="48" y1="78" x2="312" y2="78" stroke="#D8D0C5" strokeWidth="1" />
          <path d="M 92 46 L 180 46 L 268 46" fill="none" stroke="#AD2F2F" strokeWidth="2.5" />
          <g fill="#AD2F2F">
            <circle cx="92" cy="46" r="5" />
            <circle cx="180" cy="46" r="5" />
            <circle cx="268" cy="46" r="5" />
          </g>
          <g className="sentinel-label fill-charcoal text-[11px] font-semibold">
            <text x="92" y="30" textAnchor="middle">12am</text>
            <text x="180" y="30" textAnchor="middle">12am</text>
            <text x="268" y="30" textAnchor="middle">12am</text>
          </g>
          <g className="sentinel-label fill-muted text-[11px]">
            <text x="92" y="102" textAnchor="middle">Thu</text>
            <text x="180" y="102" textAnchor="middle">Fri</text>
            <text x="268" y="102" textAnchor="middle">Sat</text>
          </g>
        </svg>
      </figure>
    );
  }

  return (
    <figure className="mt-4 text-charcoal">
      <figcaption className="sentinel-label mb-2 text-[11px] font-semibold text-muted">
        Breakfast price comparison (USD)
      </figcaption>
      <svg
        viewBox="0 0 380 142"
        className="sentinel-chart h-auto w-full"
        role="img"
        aria-labelledby="offering-price-title offering-price-desc"
      >
        <title id="offering-price-title">Breakfast item price comparison</title>
        <desc id="offering-price-desc">
          Your breakfast item costs 7 dollars and 50 cents. Their new item costs 9 dollars.
        </desc>

        <g className="sentinel-label fill-muted text-[11px]">
          <text x="104" y="18">$0</text>
          <text x="222" y="18" textAnchor="middle">$5</text>
          <text x="340" y="18" textAnchor="end">$10</text>
        </g>
        <g className="stroke-ink-border" strokeWidth="1">
          <line x1="104" y1="26" x2="340" y2="26" />
          <line x1="104" y1="26" x2="104" y2="128" />
        </g>

        <g className="sentinel-label fill-muted text-[11px]">
          <text x="8" y="62">Your item</text>
          <text x="8" y="112">Their item</text>
        </g>
        <rect x="104" y="44" width="177" height="24" rx="4" fill="#2D2D2D" />
        <rect x="104" y="94" width="212" height="24" rx="4" fill="#7E9A7F" />
        <g className="sentinel-label fill-charcoal text-[11px] font-semibold">
          <text x="289" y="60">$7.50</text>
          <text x="324" y="110">$9.00</text>
        </g>
      </svg>
    </figure>
  );
}

export function Landing({
  onEnter,
  onLogin,
}: {
  onEnter: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="sentinel-landing min-h-[100dvh] bg-ink-bg text-charcoal">
      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-3 py-3 sm:px-6 sm:py-4 lg:px-10">
        <BrandLockup />
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLogin}
            className="shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold text-charcoal transition-colors duration-220 hover:bg-charcoal-50 sm:px-4 sm:text-sm"
          >
            Log in
          </button>
          <button
            onClick={onEnter}
            className="hover-lift shrink-0 whitespace-nowrap rounded-lg bg-charcoal px-3 py-2 text-xs font-semibold text-surface shadow-soft sm:px-4 sm:text-sm"
          >
            Start monitoring
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 pb-24 sm:px-6 lg:px-10">
        <section className="sentinel-hero mx-auto max-w-5xl py-16 text-center sm:py-24">
          <Reveal>
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Competitive intelligence for local businesses
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-5 text-[2.5rem] font-medium leading-[1.04] tracking-[-0.035em] text-charcoal sm:text-[4rem]">
              See what your competitors change before it costs you customers.
            </h1>
          </Reveal>
          <Reveal delay={320}>
            <p className="sentinel-body mx-auto mt-6 max-w-2xl text-lg leading-[1.6] text-muted sm:text-xl">
              m.rror monitors the local businesses competing for the same customers, tracks changes
              in pricing, offerings, promotions and positioning, and turns them into clear actions
              you can take.
            </p>
          </Reveal>
          <Reveal delay={440}>
            <p className="sentinel-label mx-auto mt-5 inline-flex rounded-full border border-semantic-opportunityBorder bg-semantic-opportunityBg px-4 py-1.5 text-[11px] font-semibold text-semantic-opportunity">
              Starting with restaurants. Built for local competition.
            </p>
          </Reveal>
          <Reveal delay={560}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onEnter}
                className="hover-lift inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-surface shadow-soft"
              >
                Start monitoring
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center whitespace-nowrap rounded-lg border border-ink-border bg-surface px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-220 hover:border-charcoal-400 hover:bg-charcoal-50"
              >
                See how it works
              </a>
            </div>
          </Reveal>
        </section>

        <section id="how-it-works" className="py-8 sm:py-12">
          <Reveal>
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-sage">How it works</p>
            <h2 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-charcoal sm:text-4xl">
              Four steps. Then it runs itself.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 140}>
                <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                  <p className="sentinel-label text-xs font-semibold text-brand-sage">{step.n}</p>
                  <h3 className="mt-3 text-lg font-semibold leading-snug text-charcoal">{step.title}</h3>
                  <p className="sentinel-body mt-2 text-base leading-[1.6] text-muted">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <Reveal>
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-sage">
              Example competitive signals
            </p>
            <h2 className="mt-2 max-w-4xl text-3xl font-medium tracking-[-0.025em] text-charcoal sm:text-4xl">
              Starting with restaurants, where competitive moves happen every day.
            </h2>
            <p className="sentinel-body mt-3 max-w-2xl text-base leading-[1.6] text-muted">
              Illustrative examples of the tone and structure, not live data. Your feed is filled
              only by scans of competitors you add.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {EXAMPLES.map((ex, i) => (
              <Reveal key={ex.title} delay={i * 140} className="self-start">
                <article className="hover-lift rounded-2xl border border-ink-border bg-surface p-5 shadow-soft">
                  <p
                    className={`sentinel-label inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${TONE_CLASS[ex.tone]}`}
                  >
                    {ex.kicker}
                  </p>
                  <h3 className="mt-3 font-semibold leading-snug text-charcoal">{ex.title}</h3>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-ink-border bg-ink-bg px-3.5 py-3">
                      <p className="sentinel-label text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                        What changed
                      </p>
                      <p className="sentinel-body mt-1 text-base leading-[1.6] text-charcoal">{ex.finding}</p>
                    </div>
                    {ex.chart && <SignalChart kind={ex.chart} />}
                    <div className="rounded-lg border border-semantic-opportunityBorder bg-semantic-opportunityBg px-3.5 py-3">
                      <p className="sentinel-label text-[10px] font-semibold uppercase tracking-[0.14em] text-semantic-opportunity">
                        Do this
                      </p>
                      <p className="sentinel-body mt-1 text-base font-medium leading-[1.6] text-charcoal">{ex.action}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <Reveal>
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-sage">
              Why local owners use it
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-[-0.025em] text-charcoal sm:text-4xl">
              Built for the gap between shifts.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REASONS.map((reason, i) => {
              const Icon = i === 0 ? Eye : i === 1 ? ListChecks : Radar;
              return (
                <Reveal key={reason.title} delay={i * 140}>
                  <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-semantic-opportunityBg text-semantic-opportunity">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 font-semibold text-charcoal">{reason.title}</h3>
                    <p className="sentinel-body mt-2 text-base leading-[1.6] text-muted">{reason.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="py-12 sm:py-16">
          <Reveal>
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-clay">
              Business model
            </p>
            <h2 className="mt-2 max-w-5xl text-3xl font-medium leading-tight tracking-[-0.025em] text-charcoal sm:text-4xl">
              Subscription priced by competitors monitored and monitoring speed.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.92fr_1.16fr_0.92fr] lg:items-stretch">
            <Reveal delay={0} className="lg:my-4">
              <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft sm:p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-charcoal">Free</h3>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-charcoal">$0</p>
                </div>
                <ul className="sentinel-body mt-8 list-disc space-y-4 pl-5 text-base leading-[1.5] text-charcoal marker:text-brand-sage">
                  {FREE_PLAN_FEATURES.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={140}>
              <article className="hover-lift h-full rounded-2xl border border-charcoal bg-charcoal p-6 text-surface shadow-lift sm:p-8">
                <div className="text-center">
                  <p className="sentinel-label mx-auto inline-flex rounded-full bg-brand-clay px-10 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-surface">
                    Core plan
                  </p>
                  <h3 className="mt-5 text-xl font-semibold">Competitive Watch</h3>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-brand-dusty">
                    $29<span className="ml-1 text-sm font-medium tracking-normal text-surface">/month</span>
                  </p>
                </div>
                <ul className="sentinel-body mt-8 list-disc space-y-4 pl-5 text-base font-medium leading-[1.5] marker:text-brand-sage">
                  {CORE_PLAN_FEATURES.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={280} className="lg:my-4">
              <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft sm:p-8">
                <h3 className="text-center text-xl font-semibold text-charcoal">Add Ons</h3>
                <dl className="sentinel-body mt-8 space-y-5 text-base text-charcoal">
                  {PRICING_ADD_ONS.map((addOn) => (
                    <div key={addOn.label} className="grid grid-cols-[1fr_auto] items-baseline gap-4">
                      <dt className="flex items-baseline gap-3">
                        <span aria-hidden="true" className="text-brand-sage">•</span>
                        {addOn.label}
                      </dt>
                      <dd className="font-medium text-brand-clay">{addOn.price}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          </div>

          <Reveal delay={360}>
            <p className="sentinel-body mt-6 text-sm italic leading-relaxed text-muted">
              All tiers include manual re-scan anytime. Pricing hypotheses will be validated through
              willingness-to-pay interviews before final launch.
            </p>
          </Reveal>
        </section>

        <Reveal>
          <section className="border-t border-ink-border py-10 sm:py-14">
            <p className="sentinel-label text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-sage">
              Where this goes next
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-medium leading-snug tracking-[-0.025em] text-charcoal">
              Local competition doesn’t stop at restaurants.
            </h2>
            <p className="sentinel-body mt-3 max-w-2xl text-base leading-[1.6] text-muted">
              m.rror is starting with restaurants, where local competition is immediate and
              measurable. The same monitoring infrastructure can expand to cafés, salons, gyms,
              retail, bookstores and other location-based businesses.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-8 rounded-2xl border border-ink-border bg-charcoal-50 px-6 py-14 text-center shadow-soft sm:px-12">
            <h2 className="text-3xl font-medium tracking-[-0.025em] text-charcoal sm:text-4xl">
              Watch the block next door. Act this week.
            </h2>
            <p className="sentinel-body mx-auto mt-4 max-w-xl text-base leading-[1.6] text-muted">
              Add a competitor, run a scan, and read the first brief. The next one arrives when they
              actually change something.
            </p>
            <button
              onClick={onEnter}
              className="hover-lift mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-surface shadow-soft"
            >
              Start monitoring
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </Reveal>
      </main>

      <footer className="border-t border-ink-border">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
          <p className="sentinel-label text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            Built with
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
            <img src="/tech/apify.svg" alt="Apify" className="h-6 w-auto sm:h-7" />
            <img src="/tech/n8n.svg" alt="n8n" className="h-6 w-auto sm:h-7" />
            <img src="/tech/bolt.svg" alt="Bolt" className="h-5 w-auto sm:h-6" />
          </div>
        </div>
      </footer>
    </div>
  );
}
