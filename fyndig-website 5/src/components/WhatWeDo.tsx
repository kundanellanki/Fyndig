import { services } from '@/data/services';
import { company } from '@/data/company';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

/** Section 6 — What We Do. */
export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="sheet section">
      <div className="shell">
        <SectionHeading
          eyebrow="What We Do"
          heading="Software, devices and the systems that join them."
          intro={company.shortDescription[1]}
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.number}
              className="group relative bg-ink-950/55 p-7 transition-colors duration-500 hover:bg-ink-800/70"
              data-reveal
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-soft transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="num text-xs text-steel">{s.number}</span>
              </div>
              <h3 className="mt-6 font-display text-[1.0625rem] font-normal leading-snug text-white">{s.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-mist">{s.description}</p>
              <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
