'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { company, navigation } from '@/data/company';
import Icon from './Icon';

/**
 * Sticky navigation.
 *
 * Transparent over the hero, then a dark translucent bar with backdrop blur and
 * a hairline border once the page scrolls. The mark is shown on a white tile
 * because the supplied logo is dark navy — the artwork itself is untouched.
 *
 * The stacked fyndig lockup (mark over wordmark over "the future") is used at
 * full size in the hero and the footer where there is room for it. A 72px bar
 * needs a horizontal lockup, so the mark is paired with the wordmark set in the
 * site typeface. /public/fyndig-logo-horizontal.png is a side-by-side version
 * of the real artwork if you ever want to swap it in.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('#home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = navigation.map((n) => n.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500',
        scrolled || open
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-md shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9)]'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <nav className="shell flex h-[72px] items-center justify-between gap-4" aria-label="Primary">
        {/* Brand */}
        <a href="#home" className="group flex items-center gap-3" aria-label={`${company.name} — home`}>
          <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-white p-[5px] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/fyndig-mark.png"
              alt=""
              width={307}
              height={308}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="font-display text-[1.25rem] font-medium lowercase tracking-tight text-white">
            {company.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? 'page' : undefined}
                className={[
                  'relative rounded-full px-2.5 py-2 text-[0.8125rem] transition-colors duration-300 xl:px-3.5 xl:text-[0.875rem]',
                  active === item.href ? 'text-white' : 'text-mist hover:text-white',
                ].join(' ')}
              >
                {item.label}
                <span
                  className={[
                    'absolute inset-x-2.5 -bottom-0.5 h-px origin-left bg-gradient-to-r from-accent to-transparent transition-transform duration-300 xl:inset-x-3.5',
                    active === item.href ? 'scale-x-100' : 'scale-x-0',
                  ].join(' ')}
                />
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn btn-primary hidden h-10 px-5 text-sm sm:inline-flex">
            Let&apos;s Talk
            <Icon name="ArrowRight" className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={[
                  'absolute left-0 block h-px w-5 bg-white transition-all duration-300',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 top-1.5 block h-px w-5 bg-white transition-all duration-200',
                  open ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />
              <span
                className={[
                  'absolute left-0 block h-px w-5 bg-white transition-all duration-300',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                ].join(' ')}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={[
          'overflow-hidden border-t border-white/10 bg-ink-950/97 transition-[max-height,opacity] duration-500 lg:hidden',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <ul className="shell flex flex-col py-4">
          {navigation.map((item, i) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-4 text-lg text-mist transition-colors hover:text-white"
                style={{ transitionDelay: open ? `${i * 30}ms` : '0ms' }}
              >
                {item.label}
                <Icon name="ArrowUpRight" className="h-4 w-4 text-steel" />
              </a>
            </li>
          ))}
          <li className="pt-5">
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Let&apos;s Talk
              <Icon name="ArrowRight" className="h-4 w-4" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
