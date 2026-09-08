import { capabilities } from '@/data/services';
import SectionHeading from './SectionHeading';
import Icon from './Icon';

/** Section 7 — Services / Capabilities. */
export default function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Capabilities"
          heading="What we can take on."
          intro="End-to-end capability across software, hardware integration, cloud and design — so a project does not have to be split across vendors."
        />

        <ul className="mt-12 grid gap-x-8 gap-y-px sm:grid-cols-2 lg:grid-cols-3" data-reveal data-reveal-stagger>
          {capabilities.map((c, i) => (
            <li
              key={c}
              className="group flex items-center gap-4 border-b border-white/8 py-4 transition-colors duration-300 hover:border-accent/40"
            >
              <span className="num text-[0.6875rem] text-steel">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-[0.9375rem] text-mist transition-colors duration-300 group-hover:text-white">
                {c}
              </span>
              <Icon
                name="Check"
                className="h-4 w-4 shrink-0 text-steel transition-colors duration-300 group-hover:text-accent"
                strokeWidth={2}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
