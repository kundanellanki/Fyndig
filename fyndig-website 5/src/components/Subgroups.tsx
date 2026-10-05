import type { CSSProperties } from 'react';
import { company } from '@/data/company';
import { subgroups, subgroupsIntro } from '@/data/subgroups';
import SectionHeading from './SectionHeading';
import SubgroupLogo from './SubgroupLogo';
import Icon from './Icon';

/**
 * Section — The fyndig Group.
 *
 * The companies that sit under fyndig. Content comes from src/data/subgroups.ts;
 * with that array empty the section renders nothing at all, so the page stays
 * correct while there is only one subgroup — or none yet.
 *
 * Each card is painted in its OWN brand colours rather than the site's navy and
 * blue, because each subgroup is its own company with its own identity. The
 * colours arrive as CSS custom properties on the card, so adding a subgroup
 * tomorrow means adding its palette to the data file and nothing more.
 */
export default function Subgroups() {
  if (subgroups.length === 0) return null;

  return (
    <section id="group" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="The Group"
          heading={`More than one company under ${company.name}.`}
          intro={subgroupsIntro}
        />

        <div
          className={[
            'mt-14 grid gap-6',
            subgroups.length > 1 ? 'lg:grid-cols-2' : 'max-w-3xl',
          ].join(' ')}
          data-reveal
          data-reveal-stagger
        >
          {subgroups.map((s) => (
            <article
              key={s.id}
              className="group relative isolate h-full overflow-hidden rounded-2xl border p-8 transition-transform duration-500 hover:-translate-y-1 sm:p-9"
              style={
                {
                  '--brand': s.brand.accent,
                  '--brand-soft': s.brand.accentSoft,
                  '--wordmark': s.brand.wordmark,
                  borderColor: `${s.brand.accent}3d`,
                  backgroundImage: `linear-gradient(158deg, ${s.brand.tintFrom} 0%, ${s.brand.tintTo} 100%)`,
                  boxShadow: `0 28px 80px -48px ${s.brand.accent}`,
                } as CSSProperties
              }
            >
              {/* Brand wash — a glow in the subgroup's own colour. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle, ${s.brand.accent}3d 0%, transparent 70%)`,
                }}
              />
              {/* A lit edge along the top of the card. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.brand.accent}, transparent)`,
                }}
              />

              <div className="relative">
                {/* Identity */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    className="text-[0.6875rem] uppercase tracking-[0.2em]"
                    style={{ color: `${s.brand.accent}c4` }}
                  >
                    {s.category}
                  </p>
                  <span
                    className="rounded-full px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em]"
                    style={{
                      color: s.brand.accentSoft,
                      backgroundColor: `${s.brand.accent}1f`,
                      border: `1px solid ${s.brand.accent}59`,
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                <h3 className="mt-7">
                  <SubgroupLogo id={s.id} name={s.name} />
                </h3>

                <p
                  className="mt-4 text-[0.9375rem] italic leading-relaxed"
                  style={{ color: `${s.brand.wordmark}b8` }}
                >
                  &ldquo;{s.tagline}&rdquo;
                </p>

                <p
                  className="mt-5 text-[0.9375rem] leading-relaxed"
                  style={{ color: `${s.brand.wordmark}cc` }}
                >
                  {s.description}
                </p>

                {/* Brand pillars */}
                {s.pillars.length > 0 ? (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {s.pillars.map((p) => (
                      <span
                        key={p}
                        className="rounded-full px-3 py-1 text-[0.6875rem] uppercase tracking-[0.16em]"
                        style={{
                          color: s.brand.accentSoft,
                          backgroundColor: `${s.brand.accent}14`,
                          border: `1px solid ${s.brand.accent}40`,
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* What it offers */}
                {s.services.length > 0 ? (
                  <ul
                    className="mt-7 space-y-2.5 border-t pt-7"
                    style={{ borderColor: `${s.brand.accent}24` }}
                  >
                    {s.services.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[0.9375rem] leading-relaxed"
                        style={{ color: `${s.brand.wordmark}c4` }}
                      >
                        <Icon
                          name="Check"
                          className="mt-[5px] h-3.5 w-3.5 shrink-0"
                          style={{ color: s.brand.accent }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Where it works, and where to find it */}
                {s.locations.length > 0 || s.href ? (
                  <div
                    className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-7"
                    style={{ borderColor: `${s.brand.accent}24` }}
                  >
                    {s.locations.length > 0 ? (
                      <p
                        className="flex items-center gap-2 text-[0.8125rem]"
                        style={{ color: `${s.brand.wordmark}8c` }}
                      >
                        <Icon name="MapPin" className="h-4 w-4 shrink-0" />
                        {s.locations.join(' · ')}
                      </p>
                    ) : (
                      <span />
                    )}

                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn h-10 px-5 text-sm font-semibold"
                        style={{
                          color: s.brand.tintTo,
                          backgroundImage: `linear-gradient(135deg, ${s.brand.accentSoft}, ${s.brand.accent})`,
                          boxShadow: `0 16px 40px -18px ${s.brand.accent}`,
                        }}
                      >
                        Visit {s.name}
                        <Icon name="ArrowUpRight" className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
