import { BrandLockup } from '@/components/BrandMark';
import { Reveal } from '@/components/Reveal';
import { Eye, Radar, ListChecks, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01',
    title: 'Add the restaurants you actually compete with',
    body: 'Point m.rror at a competitor’s menu or pricing page. We crawl from the cloud, on a schedule, without you babysitting tabs.',
  },
  {
    n: '02',
    title: 'We notice when the page genuinely changes',
    body: 'Each crawl is hashed and compared to the last snapshot. Cosmetic noise is ignored. Real movement — a new special, a price, a day-part — becomes a signal.',
  },
  {
    n: '03',
    title: 'You get one recommendation, not a dump of pages',
    body: 'An analyst-style brief: what they did, why it matters against your own offering, and a concrete move you can try this week.',
  },
];

const EXAMPLES = [
  {
    tone: 'change' as const,
    kicker: 'New change · pricing',
    title: 'New $15 lunch special undercuts your weekday plate',
    finding: 'They added a weekday lunch bundle at $15, 11am–3pm, including a drink.',
    action: 'Test an $11.95 Tue–Thu plate plus fountain drink on the sidewalk board.',
  },
  {
    tone: 'opportunity' as const,
    kicker: 'Opportunity · menu',
    title: 'They still have no breakfast burrito',
    finding: 'The breakfast board stops at tacos. No bundled breakfast item in their $8–$10 range.',
    action: 'Keep the breakfast burrito on a breakfast-only board until 11am; name the price out loud.',
  },
  {
    tone: 'threat' as const,
    kicker: 'Watch · reputation',
    title: 'Guests complain the lunch line is slow',
    finding: 'Recent page copy now apologizes for wait times during the 12–1 rush.',
    action: 'Offer a call-ahead pickup window for the same three hours they are struggling.',
  },
];

const REASONS = [
  {
    title: 'Catch it before the lunch rush does',
    body: 'A competitor’s special is useful the morning it lands — not when a regular mentions it a week later.',
  },
  {
    title: 'Written for the person between shifts',
    body: 'Short, numbered, specific. No dashboards of raw crawls. One action you can try this week.',
  },
  {
    title: 'Your prices, not generic advice',
    body: 'Every signal is compared to what you already sell. If it doesn’t touch your board, it doesn’t make the cut.',
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
            className="hover-lift rounded-full bg-navy px-4 py-2 text-sm font-semibold text-surface shadow-soft"
          >
            Start monitoring
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <section className="mx-auto max-w-3xl py-16 text-center sm:py-24">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Competitive intelligence for independent restaurants
            </p>
          </Reveal>
          <Reveal delay={160}>
            <h1 className="mt-5 font-serif text-[2.15rem] font-semibold leading-[1.15] tracking-tight text-navy sm:text-5xl">
              See what your competitors change before it costs you customers.
            </h1>
          </Reveal>
          <Reveal delay={320}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              m.rror watches the local restaurants you actually compete with. It tracks pricing,
              menu, and promotional changes on their pages, then turns each real movement into a
              short, actionable recommendation — written for the owner, not an analyst.
            </p>
          </Reveal>
          <Reveal delay={480}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onEnter}
                className="hover-lift inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-surface shadow-soft"
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
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy">
              Three steps. Then it runs itself.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 140}>
                <article className="hover-lift rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                  <p className="font-serif text-sm text-muted">{step.n}</p>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-navy">{step.title}</h3>
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
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy">
              What a brief looks like
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Illustrative examples of the tone and structure — not live data. Your feed is filled
              only by scans of competitors you add.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {EXAMPLES.map((ex, i) => (
              <Reveal key={ex.title} delay={i * 140}>
                <article className="hover-lift rounded-2xl border border-ink-border bg-surface p-5 shadow-soft">
                  <p
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASS[ex.tone]}`}
                  >
                    {ex.kicker}
                  </p>
                  <h3 className="mt-3 font-bold leading-snug text-navy">{ex.title}</h3>
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
                      <p className="mt-1 text-sm font-semibold leading-relaxed text-navy">{ex.action}</p>
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
              Why restaurant owners use it
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-navy">
              Built for the gap between shifts.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {REASONS.map((reason, i) => {
              const Icon = i === 0 ? Eye : i === 1 ? ListChecks : Radar;
              return (
                <Reveal key={reason.title} delay={i * 140}>
                  <article className="hover-lift rounded-2xl border border-ink-border bg-surface p-6 shadow-soft">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-charcoal-50 text-charcoal">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 font-bold text-navy">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{reason.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
          <section className="mt-8 rounded-3xl border border-ink-border bg-surface px-6 py-14 text-center shadow-soft sm:px-12">
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
              Watch the board next door. Act this week.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Add a competitor, run a scan, and read the first brief. The next one arrives when they
              actually change something.
            </p>
            <button
              onClick={onEnter}
              className="hover-lift mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-surface shadow-soft"
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
