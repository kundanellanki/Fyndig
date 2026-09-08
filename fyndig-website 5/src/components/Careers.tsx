import { applyMailto, careersSection, formatPostedOn, openJobs as staticJobs, type Job } from '@/data/jobs';
import { contact } from '@/data/company';
import { apiConfigured, fetchJobs } from '@/lib/api';
import SectionHeading from './SectionHeading';
import ApplyForm from './ApplyForm';
import Icon from './Icon';

/**
 * Careers.
 *
 * Roles come from the backend when one is configured and reachable, and from
 * src/data/jobs.ts otherwise — so the section is correct whether or not the API
 * is up, and a role can still be published by editing the data file.
 *
 * With no open roles the section shows an honest empty state plus an open
 * application route — no placeholder jobs.
 *
 * Each role is a native <details> disclosure, so it expands without JavaScript
 * and is keyboard-accessible by default. The application form only renders when
 * a backend exists to receive it; otherwise the pre-filled email link stands in.
 */
export default async function Careers() {
  const fromApi = await fetchJobs();
  const openJobs = (fromApi ?? staticJobs).filter((j) => j.open !== false);
  const hasRoles = openJobs.length > 0;
  // Only offer the form when there is something on the other end of it.
  const canApplyOnSite = apiConfigured && fromApi !== null;

  return (
    <section id="careers" className="sheet section">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={careersSection.eyebrow}
            heading={careersSection.heading}
            intro={careersSection.intro}
            className="lg:max-w-2xl"
          />

          <div className="flex items-center gap-3 lg:pb-2" data-reveal="fade">
            <span
              className={[
                'h-2 w-2 shrink-0 rounded-full',
                hasRoles ? 'bg-accent animate-pulseNode' : 'bg-steel',
              ].join(' ')}
              aria-hidden="true"
            />
            <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel">
              {hasRoles
                ? `${openJobs.length} open ${openJobs.length === 1 ? 'role' : 'roles'}`
                : 'No open roles'}
            </span>
          </div>
        </div>

        {hasRoles ? (
          <>
            <ul className="mt-12 space-y-4" data-reveal data-reveal-stagger>
              {openJobs.map((job) => (
                <li key={job.id} id={job.id}>
                  <details className="card group overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-accent-soft">
                            {job.type}
                          </span>
                          <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel">
                            {job.department}
                          </span>
                        </div>

                        <h3 className="mt-3 font-display text-xl font-normal text-white sm:text-2xl">
                          {job.title}
                        </h3>

                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8125rem] text-steel">
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="MapPin" className="h-3.5 w-3.5" />
                            {job.location} · {job.mode}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="Users" className="h-3.5 w-3.5" />
                            {job.experience}
                          </span>
                          {formatPostedOn(job.postedOn) && (
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name="Clock" className="h-3.5 w-3.5" />
                              Posted {formatPostedOn(job.postedOn)}
                            </span>
                          )}
                        </p>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-2 text-[0.875rem] text-accent-soft transition-colors group-open:text-white">
                        <span className="group-open:hidden">View role</span>
                        <span className="hidden group-open:inline">Hide details</span>
                        <Icon
                          name="ChevronRight"
                          className="h-4 w-4 transition-transform duration-300 group-open:rotate-90"
                        />
                      </span>
                    </summary>

                    <div className="border-t border-white/8 px-6 pb-7 pt-6 sm:px-7">
                      <p className="lead text-[0.9375rem]">{job.summary}</p>

                      <div className="mt-7 grid gap-7 md:grid-cols-3">
                        <JobList title="What you'll do" items={job.responsibilities} icon="Workflow" />
                        <JobList title="What we're looking for" items={job.requirements} icon="Check" />
                        <JobList title="Nice to have" items={job.niceToHave} icon="Sparkles" />
                      </div>

                      {job.applyUrl ? (
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary h-11 px-5 text-sm"
                          >
                            Apply for this role
                            <Icon name="ArrowUpRight" className="h-4 w-4" />
                          </a>
                          <ApplyByEmail job={job} />
                        </div>
                      ) : canApplyOnSite ? (
                        <div className="mt-8 border-t border-white/8 pt-7">
                          <h4 className="flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.2em] text-steel">
                            <Icon name="ArrowRight" className="h-3.5 w-3.5 text-accent-soft" />
                            Apply for this role
                          </h4>
                          <ApplyForm slug={job.id} title={job.title} />
                          <p className="mt-5 text-[0.8125rem] text-steel">
                            <ApplyByEmail job={job} prefix="Prefer email? Write to" />
                          </p>
                        </div>
                      ) : (
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                          <a href={applyMailto(job)} className="btn btn-primary h-11 px-5 text-sm">
                            Apply for this role
                            <Icon name="ArrowRight" className="h-4 w-4" />
                          </a>
                          <ApplyByEmail job={job} />
                        </div>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ul>

            {canApplyOnSite ? (
              <details className="card group mt-8 overflow-hidden [&_summary::-webkit-details-marker]:hidden" data-reveal>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 sm:p-7">
                  <span className="text-[0.9375rem] text-mist">
                    Nothing here that fits? Send an open application — we read every one.
                  </span>
                  <Icon
                    name="ChevronRight"
                    className="h-4 w-4 shrink-0 text-accent-soft transition-transform duration-300 group-open:rotate-90"
                  />
                </summary>
                <div className="border-t border-white/8 px-6 pb-7 pt-2 sm:px-7">
                  <ApplyForm slug="open" title="an open application" />
                </div>
              </details>
            ) : (
              <p className="mt-8 text-[0.875rem] text-steel" data-reveal>
                Nothing here that fits?{' '}
                <a
                  href={applyMailto()}
                  className="text-mist underline underline-offset-4 transition-colors hover:text-white"
                >
                  Send an open application
                </a>{' '}
                — we read every one.
              </p>
            )}
          </>
        ) : (
          <div className="card mt-12 p-10 text-center sm:p-14" data-reveal="scale">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-steel">
              <Icon name="Search" className="h-6 w-6" />
            </span>

            <h3 className="mt-6 font-display text-2xl font-light text-white">
              {careersSection.emptyHeading}
            </h3>

            <p className="lead mx-auto mt-4 max-w-xl text-[0.9375rem]">{careersSection.emptyBody}</p>

            {canApplyOnSite ? (
              <>
                <div className="mx-auto mt-9 max-w-2xl text-left">
                  <ApplyForm slug="open" title="an open application" />
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a href="#contact" className="btn btn-ghost h-11 px-5 text-sm">
                    Talk to us
                  </a>
                </div>
              </>
            ) : (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href={applyMailto()} className="btn btn-primary h-11 px-5 text-sm">
                  {careersSection.openApplicationLabel}
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </a>
                <a href="#contact" className="btn btn-ghost h-11 px-5 text-sm">
                  Talk to us
                </a>
              </div>
            )}

            <p className="mt-7 text-[0.8125rem] text-steel">
              Applications go to{' '}
              <a
                href={`mailto:${contact.email}`}
                className="text-mist underline underline-offset-4 transition-colors hover:text-white"
              >
                {contact.email}
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ApplyByEmail({ job, prefix = 'or email' }: { job: Job; prefix?: string }) {
  const address = job.applyEmail ?? careersSection.applyEmail;
  return (
    <span className="text-[0.8125rem] text-steel">
      {prefix}{' '}
      <a
        href={`mailto:${address}`}
        className="text-mist underline underline-offset-4 transition-colors hover:text-white"
      >
        {address}
      </a>
    </span>
  );
}

function JobList({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.2em] text-steel">
        <Icon name={icon} className="h-3.5 w-3.5 text-accent-soft" />
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-mist">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
