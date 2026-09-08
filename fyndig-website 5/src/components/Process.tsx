import { processSteps } from '@/data/services';
import { company } from '@/data/company';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

/** Section 16 — Our Process. */
export default function Process() {
  return (
    <section id="process" className="sheet section">
      <div className="shell">
        <SectionHeading
          eyebrow="Our Process"
          heading="From Idea to Impact"
          intro={company.approach.statement}
          align="center"
        />

        <ol className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal data-reveal-stagger>
          {processSteps.map((s) => (
            <li key={s.number} className="card group h-full p-6">
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-soft transition-colors duration-500 group-hover:border-accent/40">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="num font-display text-2xl font-light text-white/12 transition-colors duration-500 group-hover:text-accent/45">
                  {s.number}
                </span>
              </div>
              <h3 className="mt-6 font-display text-[1.0625rem] font-normal leading-snug text-white">{s.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-mist">{s.description}</p>
            </li>
          ))}
        </ol>

        <p className="lead mx-auto mt-14 max-w-3xl text-center" data-reveal>
          {company.approach.closing}
        </p>
      </div>
    </section>
  );
}
