export default function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = 'left',
  className = '',
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={[
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl',
        className,
      ].join(' ')}
    >
      <p className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`} data-reveal="fade">
        {eyebrow}
      </p>
      <h2 className="h-section mt-5" data-reveal="blur">
        {heading}
      </h2>
      {intro ? (
        <p className="lead mt-6" data-reveal data-reveal-delay="0.1">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
