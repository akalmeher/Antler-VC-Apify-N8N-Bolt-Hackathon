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
    body: 'Point m.rror at the pages that actually move — pricing, offerings, promotions. We monitor from the cloud, on a schedule, without you babysitting tabs.',
  },
  {
    n: '03',
    title: 'm.rror monitors what changes',
    body: 'Each check is compared against the last snapshot. Cosmetic noise is ignored. Real movement — a new price, a new offer, a new day-part — becomes a signal.',
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
    kicker: 'New change · promotion',
    title: 'They launched a weekday lunch promotion',
    finding: 'A new $15 lunch bundle runs 11am–3pm, Monday through Friday, and includes a drink.',
    action: 'Test an $11.95 Tue–Thu plate plus fountain drink on the sidewalk board.',
  },
  {
    tone: 'threat' as const,
    kicker: 'Watch · pricing',
    title: 'They cut prices on their most comparable item',
    finding: 'Their signature plate dropped from $16.50 to $14.00 while yours held at $15.75.',
    action: 'Hold your price, but make the portion difference explicit on the board and online.',
  },
  {
    tone: 'change' as const,
    kicker: 'New change · hours',
    title: 'They extended hours into the late-night window',
    finding: 'The location now stays open until midnight Thursday through Saturday.',
    action: 'Pick one of those nights and stay open an extra hour before matching all three.',
  },
  {
    tone: 'opportunity' as const,
    kicker: 'Opportunity · offering',
    title: 'They added a new offering you already do better',
    finding: 'A breakfast item appeared on their board at $9, above your existing $7.50 version.',
    action: 'Put your breakfast item on a morning-only board and name the price out loud.',
  },
];

const REASONS = [
  {
    title: 'Catch it before your customers do',
    body: 'A competitor’s new offer matters the morning it lands — not when a regular mentions it a week later.',
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

const TONE_CLASS = {
  change: 'border-semantic-warningBorder bg-semantic-warningBg text-brand-dusty',
  opportunity: 'border-semantic-opportunityBorder bg-semantic-opportunityBg text-semantic-opportunity',
  threat: 'border-semantic-threatBorder bg-semantic-threatBg text-semantic-threat',
};

export function Landing({
  onEnter,
  onLogin,
}: {
  onEnter: () => void;
  onLogin: () => void;
}) {
  return (
    <div className="min-h-screen bg-ink-bg text-charcoal">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <BrandLockup />
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLogin}
            className="rounded-full px-4 py-2 text-sm font-semibold text-charcoal transition-colors duration-220 hover:bg-surface"
          >
            Log in
          </button>
          <button
            onClick={onEnter}
            className="hover-lift rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-surface shadow-soft"
          >
            Start monitoring
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section className="mx-auto max-w-3xl py-16 text-center sm:py-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Competitive intelligence for local businesses
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-5 font-serif text-[2.15rem] font-semibold leading-[1.15] tracking-tight text-charcoal sm:text-5xl">
              See what your competitors change before it costs you customers.
            </h1>
          </Reveal>
          <Reveal delay={320}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              m.rror monitors the local businesses competing for the same customers, tracks changes
              in pricing, offerings, promotions and positioning, and turns them into clear actions
              you can take.
            </p>
          </Reveal>
          <Reveal delay={440}>
            <p className="mx-auto mt-5 inline-flex rounded-full border border-ink-border bg-surface px-4 py-1.5 text-xs font-semibold text-charcoal">
              Starting with restaurants. Built for local competition.
            </p>
          </Reveal>
          <Reveal delay={560}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onEnter}
                className="hover-lift inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-surface shadow-soft"
              >
                Start monitoring
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center rounded-full border border-ink-border bg-surface px-6 py-3 text-sm font-semibold text-charcoal transition-colors duration-220 hover:border-charcoal-200"
              >
                See how it works
              </a>
            </div>
          </Reveal>
        </section>

        <section id="how-it-works" className="py-8 sm:py-12">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">How it works</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal">
              Four steps. Then it runs itself.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 140}>
                <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                  <p className="font-serif text-sm text-muted">{step.n}</p>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-charcoal">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Example competitive signals
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal">
              Starting with restaurants, where competitive moves happen every day.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Illustrative examples of the tone and structure — not live data. Your feed is filled
              only by scans of competitors you add.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {EXAMPLES.map((ex, i) => (
              <Reveal key={ex.title} delay={i * 140}>
                <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-5 shadow-soft">
                  <p
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASS[ex.tone]}`}
                  >
                    {ex.kicker}
                  </p>
                  <h3 className="mt-3 font-bold leading-snug text-charcoal">{ex.title}</h3>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-ink-border bg-ink-bg px-3.5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                        What changed
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal">{ex.finding}</p>
                    </div>
                    <div className="rounded-xl border border-semantic-opportunityBorder bg-semantic-opportunityBg px-3.5 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-semantic-opportunity">
                        Do this
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-charcoal">{ex.action}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Why local owners use it
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal">
              Built for the gap between shifts.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REASONS.map((reason, i) => {
              const Icon = i === 0 ? Eye : i === 1 ? ListChecks : Radar;
              return (
                <Reveal key={reason.title} delay={i * 140}>
                  <article className="hover-lift h-full rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal-50 text-charcoal">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 font-bold text-charcoal">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{reason.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
          <section className="border-t border-ink-border py-10 sm:py-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Where this goes next
            </p>
            <h2 className="mt-2 max-w-2xl font-serif text-2xl font-semibold leading-snug tracking-tight text-charcoal">
              Local competition doesn’t stop at restaurants.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              m.rror is starting with restaurants, where local competition is immediate and
              measurable. The same monitoring infrastructure can expand to cafés, salons, gyms,
              retail, bookstores and other location-based businesses.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-8 rounded-3xl border border-ink-border bg-surface px-6 py-14 text-center shadow-soft sm:px-12">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
              Watch the block next door. Act this week.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Add a competitor, run a scan, and read the first brief. The next one arrives when they
              actually change something.
            </p>
            <button
              onClick={onEnter}
              className="hover-lift mt-8 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-surface shadow-soft"
            >
              Start monitoring
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
