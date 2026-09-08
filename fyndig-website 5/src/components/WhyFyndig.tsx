import { whyFyndig } from '@/data/services';
import { company } from '@/data/company';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

/** Section 17 — Why fyndig. */
export default function WhyFyndig() {
  return (
    <section id="why" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={`Why ${company.name}`}
          heading="Six reasons the work holds up."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-stagger>
          {whyFyndig.map((w) => (
            <article key={w.number} className="card group h-full p-7">
              <div className="flex items-center gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                  <Icon name={w.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="num text-xs text-steel">{w.number}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-normal text-white">{w.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">{w.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
