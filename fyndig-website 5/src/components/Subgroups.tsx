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
 *
 * The card is deliberately compact: a calling card for the company, not a page
 * about it. Anyone who wants the detail follows the link to its own site.
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
            'mt-10 grid gap-5',
            // One card stays a calling card; two sit side by side; three or
            // more go three across once there is room for them.
            subgroups.length === 1
              ? 'max-w-md'
              : subgroups.length === 2
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-3',
          ].join(' ')}
          data-reveal
          data-reveal-stagger
        >
          {subgroups.map((s) => (
            <article
              key={s.id}
              className="group relative isolate h-full overflow-hidden rounded-xl border p-5 transition-transform duration-500 hover:-translate-y-1 sm:p-6"
              style={
                {
                  '--brand': s.brand.accent,
                  '--brand-soft': s.brand.accentSoft,
                  '--wordmark': s.brand.wordmark,
                  borderColor: `${s.brand.accent}3d`,
                  backgroundImage: `linear-gradient(158deg, ${s.brand.tintFrom} 0%, ${s.brand.tintTo} 100%)`,
                  boxShadow: `0 20px 56px -40px ${s.brand.accent}`,
                } as CSSProperties
              }
            >
              {/* Brand wash — a glow in the subgroup's own colour. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className="text-[0.625rem] uppercase tracking-[0.18em]"
                    style={{ color: `${s.brand.accent}c4` }}
                  >
                    {s.category}
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[0.5625rem] font-medium uppercase tracking-[0.16em]"
                    style={{
                      color: s.brand.accentSoft,
                      backgroundColor: `${s.brand.accent}1f`,
                      border: `1px solid ${s.brand.accent}59`,
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                <h3 className="mt-4">
                  <SubgroupLogo id={s.id} name={s.name} />
                </h3>

                <p
                  className="mt-2 text-[0.8125rem] italic leading-snug"
                  style={{ color: `${s.brand.wordmark}b0` }}
                >
                  &ldquo;{s.tagline}&rdquo;
                </p>

                <p
                  className="mt-3 text-[0.8125rem] leading-relaxed"
                  style={{ color: `${s.brand.wordmark}c4` }}
                >
                  {s.description}
                </p>

                {/* Brand pillars */}
                {s.pillars.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.pillars.map((p) => (
                      <span
                        key={p}
                        className="rounded-full px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.14em]"
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
                    className="mt-4 space-y-1.5 border-t pt-4"
                    style={{ borderColor: `${s.brand.accent}24` }}
                  >
                    {s.services.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[0.75rem] leading-snug"
                        style={{ color: `${s.brand.wordmark}bb` }}
                      >
                        <Icon
                          name="Check"
                          className="mt-[3px] h-3 w-3 shrink-0"
                          style={{ color: s.brand.accent }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Who runs it, where it works, and where to find it */}
                {s.founder || s.locations.length > 0 || s.href ? (
                  <div
                    className="mt-5 flex flex-col gap-3 border-t pt-4"
                    style={{ borderColor: `${s.brand.accent}24` }}
                  >
                    <div className="space-y-1.5">
                      {s.founder ? (
                        <p
                          className="flex items-center gap-1.5 text-[0.6875rem]"
                          style={{ color: `${s.brand.wordmark}b0` }}
                        >
                          <Icon
                            name="User"
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: s.brand.accent }}
                          />
                          <span>
                            <span
                              className="uppercase tracking-[0.12em]"
                              style={{ color: `${s.brand.wordmark}70` }}
                            >
                              Founder
                            </span>{' '}
                            {s.founder}
                          </span>
                        </p>
                      ) : null}

                      {s.locations.length > 0 ? (
                        <p
                          className="flex items-center gap-1.5 text-[0.6875rem]"
                          style={{ color: `${s.brand.wordmark}8c` }}
                        >
                          <Icon name="MapPin" className="h-3.5 w-3.5 shrink-0" />
                          {s.locations.join(' · ')}
                        </p>
                      ) : null}
                    </div>

                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn h-8 self-end px-3.5 text-[0.75rem] font-semibold"
                        style={{
                          color: s.brand.tintTo,
                          backgroundImage: `linear-gradient(135deg, ${s.brand.accentSoft}, ${s.brand.accent})`,
                          boxShadow: `0 12px 30px -16px ${s.brand.accent}`,
                        }}
                      >
                        Visit {s.name}
                        <Icon name="ArrowUpRight" className="h-3.5 w-3.5" />
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
