/**
 * ---------------------------------------------------------------------------
 * Background — the fixed cinematic environment
 * ---------------------------------------------------------------------------
 * TWO stationary `position: fixed` layers behind everything:
 *   1. .site-bg          the forest photograph (cover / center / no-repeat)
 *   2. .site-bg__overlay the navy grade + the fine technology grid, in one layer
 *
 * NONE of these layers is ever animated, translated, scaled or given to GSAP.
 * They are not ScrollTrigger targets and carry no transition. The page content
 * scrolls over them, which is the defining visual feature of the site.
 *
 * To swap the background image, replace /public/forest-background.jpg and
 * /public/forest-background-mobile.jpg (or point the constants below at other
 * files in /public). A higher-resolution source photograph would render
 * sharper on large displays — the current one is upscaled from 512px.
 * ---------------------------------------------------------------------------
 */

const BACKGROUND_IMAGE = '/forest-background.jpg';
/** Half-size file for phones and small tablets — same framing, a third of the bytes. */
const BACKGROUND_IMAGE_SMALL = '/forest-background-mobile.jpg';

export default function Background() {
  return (
    <>
      <div
        className="site-bg"
        style={
          {
            '--site-bg-image': `url('${BACKGROUND_IMAGE}')`,
            '--site-bg-image-small': `url('${BACKGROUND_IMAGE_SMALL}')`,
          } as React.CSSProperties
        }
        aria-hidden="true"
        role="presentation"
      />
      <div className="site-bg__overlay" aria-hidden="true" />
    </>
  );
}
