import { futureVision, visualStory } from '@/data/services';
import { company } from '@/data/company';
import Icon from './Icon';

/**
 * Section 18 — Future Vision, with the visual story arc (section 32).
 * Deliberately the most open section on the page: minimal surfaces so the fixed
 * forest reads through behind the type.
 */
export default function Vision() {
  return (
    <section id="vision" className="section">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center" data-reveal="fade">
            Future Vision
          </p>
          <h2 className="h-section mt-5" data-reveal="blur">
            {futureVision.heading}
          </h2>
          <div className="mt-7 space-y-5">
            {futureVision.body.map((p, i) => (
              <p key={i} className="lead" data-reveal data-reveal-delay={`${0.08 * i}`}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* The story arc */}
        <ul
          className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-4"
          data-reveal
          data-reveal-stagger
        >
          {visualStory.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="glass-pill rounded-full px-4 py-2 text-[0.8125rem] text-mist">{step}</span>
              {i < visualStory.length - 1 && (
                <Icon name="ArrowRight" className="hidden h-3.5 w-3.5 text-steel sm:block" />
              )}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-14 max-w-2xl text-center text-[0.9375rem] leading-relaxed text-steel" data-reveal>
          {company.name} builds software, IoT, automation, data and smart products — and combines them into
          connected solutions.
        </p>
      </div>
    </section>
  );
}
