import { contact, mapEmbedHref, telHref } from '@/data/company';
import Icon from './Icon';

/**
 * Section 21 — Find Us.
 *
 * The map is embedded at the exact pin from `contact.coordinates` using
 * Google's keyless embed endpoint — no API key, no billing account.
 *
 * The styled placeholder sits UNDERNEATH the iframe rather than being replaced
 * by it. If the map is blocked (a strict CSP, an ad blocker, no network) the
 * panel still reads as a designed element instead of an empty white box.
 */
export default function Location() {
  return (
    <section id="location" className="section">
      <div className="shell">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Details */}
            <div className="p-8 sm:p-11">
              <p className="eyebrow" data-reveal="fade">
                Find Us
              </p>
              <h2 className="h-section mt-5 !text-[clamp(1.75rem,3vw,2.5rem)]" data-reveal="blur">
                Based in Tirupati.
              </h2>

              <address className="mt-8 not-italic">
                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-soft">
                    <Icon name="MapPin" className="h-[18px] w-[18px]" />
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-mist">
                    {contact.address.line1},<br />
                    {contact.address.city},<br />
                    {contact.address.state} – {contact.address.postalCode},<br />
                    {contact.address.country}
                  </p>
                </div>
              </address>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary h-11 px-5 text-sm"
                >
                  Open in Google Maps
                  <Icon name="ArrowUpRight" className="h-4 w-4" />
                </a>
                <a href={telHref(contact.primaryPhone)} className="btn btn-ghost h-11 px-5 text-sm">
                  <Icon name="Phone" className="h-4 w-4" />
                  Call us
                </a>
              </div>

              <p className="mt-8 flex items-center gap-2 text-[0.8125rem] text-steel">
                <Icon name="Clock" className="h-4 w-4" />
                {contact.workingHours}
              </p>
            </div>

            {/* Map placeholder */}
            <div
              className="relative min-h-[280px] border-t border-white/8 lg:min-h-full lg:border-l lg:border-t-0"
              data-reveal="fade"
            >
              <div className="absolute inset-0 bg-ink-950/55" />
              <div
                className="absolute inset-0 opacity-45"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(143,187,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(143,187,255,0.10) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
                aria-hidden="true"
              />
              {/* Fallback, visible only if the embed below cannot load. */}
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent/35 bg-accent/10 text-accent-soft">
                    <Icon name="MapPin" className="h-6 w-6" />
                    <span className="absolute inset-0 rounded-full border border-accent/25 animate-pulseNode" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-[0.9375rem] text-white">
                    {contact.address.city}, {contact.address.state}
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] text-steel">Open the address in Google Maps.</p>
                </div>
              </div>

              <iframe
                title={`Map of ${contact.address.line1}, ${contact.address.city}`}
                src={mapEmbedHref(contact.coordinates.lat, contact.coordinates.lng)}
                className="site-map absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
