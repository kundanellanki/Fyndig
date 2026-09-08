import { company } from '@/data/company';
import { pillars } from '@/data/services';
import Icon from './Icon';

/** Section 14 — About. Split layout: story on the left, animated tech visual right. */
export default function About() {
  return (
    <section id="about" className="section">
      <div className="shell grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
        {/* Story */}
        <div>
          <p className="eyebrow" data-reveal="fade">
            About {company.name}
          </p>
          <h2 className="h-section mt-5" data-reveal="blur">
            Technology With Purpose.
          </h2>

          <div className="mt-7 space-y-5">
            {company.fullDescription.map((p, i) => (
              <p key={i} className="lead" data-reveal data-reveal-delay={`${0.06 * i}`}>
                {p}
              </p>
            ))}
          </div>

          {/* Mission + Vision */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2" data-reveal-stagger data-reveal>
            <div className="card p-6">
              <p className="text-[0.6875rem] font-medium uppercase tracking-ultra text-accent-soft">Mission</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">{company.mission}</p>
            </div>
            <div className="card p-6">
              <p className="text-[0.6875rem] font-medium uppercase tracking-ultra text-accent-soft">Vision</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">{company.vision[0]}</p>
            </div>
          </div>
        </div>

        {/* Animated technology visual */}
        <div className="relative" data-reveal="right">
          <div className="card overflow-hidden p-8 sm:p-10">
            {/* Orbit visual */}
            <div className="relative mx-auto aspect-square w-full max-w-[380px]">
              <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <radialGradient id="coreGlow">
                    <stop offset="0%" stopColor="#5B9BFF" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#5B9BFF" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.07)" />
                <circle cx="200" cy="200" r="108" fill="none" stroke="rgba(255,255,255,0.09)" />
                <circle cx="200" cy="200" r="64" fill="none" stroke="rgba(143,187,255,0.22)" />
                <circle cx="200" cy="200" r="95" fill="url(#coreGlow)" />

                {/* connection spokes */}
                {[0, 60, 120, 180, 240, 300].map((deg) => {
                  const r = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={deg}
                      x1={200 + Math.cos(r) * 64}
                      y1={200 + Math.sin(r) * 64}
                      x2={200 + Math.cos(r) * 150}
                      y2={200 + Math.sin(r) * 150}
                      stroke="rgba(143,187,255,0.16)"
                    />
                  );
                })}

                {/* orbit nodes */}
                {[
                  [0, 150],
                  [60, 108],
                  [120, 150],
                  [180, 108],
                  [240, 150],
                  [300, 108],
                ].map(([deg, rad], i) => {
                  const r = (deg * Math.PI) / 180;
                  return (
                    <circle
                      key={deg}
                      cx={200 + Math.cos(r) * rad}
                      cy={200 + Math.sin(r) * rad}
                      r="4.5"
                      fill="#8FBBFF"
                      className="animate-pulseNode"
                      style={{ animationDelay: `${i * 0.45}s` }}
                    />
                  );
                })}
              </svg>

              {/* Core */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="grid h-[86px] w-[86px] place-items-center rounded-2xl border border-white/12 bg-ink-900/90">
                  <Icon name="Cpu" className="h-8 w-8 text-accent-soft" />
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-[0.8125rem] leading-relaxed text-steel">
              Software, devices, data and people — connected into one intelligent system.
            </p>
          </div>
        </div>
      </div>

      {/* Supporting concepts */}
      <div className="shell mt-16 grid gap-4 sm:grid-cols-3" data-reveal data-reveal-stagger>
        {pillars.map((p) => (
          <div key={p.number} className="card p-7">
            <div className="flex items-center justify-between">
              <span className="num text-sm text-steel">{p.number}</span>
              <Icon name={p.icon} className="h-5 w-5 text-accent-soft" />
            </div>
            <h3 className="mt-6 font-display text-xl font-normal text-white">{p.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-mist">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
