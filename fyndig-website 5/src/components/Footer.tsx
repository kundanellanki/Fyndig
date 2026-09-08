import Image from 'next/image';
import { company, contact, navigation, socials, telHref } from '@/data/company';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-ink-950/92">
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
          {/* Brand */}
          <div>
            <div className="brand-plate inline-flex items-center justify-center px-5 py-4">
              <Image
                src="/fyndig-logo.png"
                alt={`${company.name} — ${company.tagline}`}
                width={533}
                height={567}
                className="h-[76px] w-auto"
              />
            </div>
            <p className="mt-6 max-w-xs text-[0.9375rem] leading-relaxed text-mist">{company.tagline}</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <h2 className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Navigation</h2>
            <ul className="mt-5 space-y-2.5">
              {navigation.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-[0.9375rem] text-mist transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-[0.625rem] uppercase tracking-[0.2em] text-steel">Contact</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              <li className="flex items-center gap-2.5">
                <Icon name="Mail" className="h-4 w-4 shrink-0 text-steel" />
                <a href={`mailto:${contact.email}`} className="text-mist transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="Phone" className="h-4 w-4 shrink-0 text-steel" />
                <a href={telHref(contact.primaryPhone)} className="text-mist transition-colors hover:text-white">
                  {contact.primaryPhone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="MapPin" className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
                <span className="text-mist">{contact.address.short}</span>
              </li>
            </ul>

            {/* Social links render only once accounts are added to src/data/company.ts */}
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-pill rounded-full px-3.5 py-1.5 text-[0.8125rem] text-mist transition-colors hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-steel">
            © {company.founded} {company.name}. All rights reserved.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-[0.8125rem] text-steel transition-colors hover:text-white"
          >
            Back to top
            <Icon name="ArrowUpRight" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
