import { connectionFlow } from '@/data/services';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

/**
 * Section 15 — Connecting the Physical & Digital Worlds.
 *
 * The flow line and nodes reveal as the section scrolls into view (foreground
 * animation only — the forest background stays fixed).
 */
export default function ConnectedTechnology() {
  return (
    <section id="connected" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Connected Technology"
          heading="Connecting the Physical & Digital Worlds."
          intro="A signal starts at a device and ends as a decision. Everything in between is what we build."
          align="center"
        />

        <div className="relative mt-16">
          {/* Vertical spine on mobile / horizontal rail on desktop */}
          <div
            className="pointer-events-none absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/35 to-transparent md:left-0 md:top-[46px] md:h-px md:w-full md:bg-gradient-to-r"
            aria-hidden="true"
          />

          <ol className="grid gap-6 md:grid-cols-4 lg:grid-cols-8" data-reveal data-reveal-stagger>
            {connectionFlow.map((step, i) => (
              <li key={step.label} className="relative flex items-center gap-4 md:block md:text-center">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/12 bg-ink-950/90 text-accent-soft md:mx-auto">
                  <Icon name={step.icon} className="h-[22px] w-[22px]" />
                  <span
                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent animate-pulseNode"
                    style={{ animationDelay: `${i * 0.3}s` }}
                    aria-hidden="true"
                  />
                </span>
                <div className="md:mt-4">
                  <span className="num block text-[0.6875rem] text-steel">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-1 block text-[0.875rem] font-medium leading-snug text-white">
                    {step.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
