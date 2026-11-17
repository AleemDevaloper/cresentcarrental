import { Children, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { prefersReducedMotion } from '../config/experienceConfig';

function pad(value) {
  return String(value).padStart(2, '0');
}

export default function SmartCarousel({
  items,
  children,
  className = '',
  trackClassName = '',
  ariaLabel = 'Carousel',
  itemLabel = 'item',
  autoPlay = true,
  interval = 5200,
}) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const count = Math.max(items.length, Children.count(children));

  const scrollToIndex = (index, behavior = 'smooth') => {
    const track = trackRef.current;
    const child = track?.children[index];
    if (!track || !child) return;
    const left = child.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior });
  };

  const updatePosition = () => {
    const track = trackRef.current;
    if (!track) return;
    const children = [...track.children];
    if (!children.length) return;
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let distance = Infinity;
    children.forEach((child, index) => {
      const nextDistance = Math.abs(child.getBoundingClientRect().left - trackLeft - 8);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = index;
      }
    });
    const max = track.scrollWidth - track.clientWidth;
    setActive(closest);
    setProgress(max > 0 ? Math.min(100, Math.max(0, (track.scrollLeft / max) * 100)) : 100);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updatePosition();
    const onScroll = () => window.requestAnimationFrame(updatePosition);
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updatePosition);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updatePosition);
      observer.disconnect();
    };
  }, [count]);

  useEffect(() => {
    if (!autoPlay || paused || !inView || count < 2 || prefersReducedMotion()) return undefined;
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = (active + 1) % count;
      const child = track.children[next];
      if (!child) return;
      const left = child.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      track.scrollTo({ left, behavior: 'smooth' });
    }, interval);
    return () => window.clearInterval(timer);
  }, [active, autoPlay, count, inView, interval, paused]);

  const go = (direction) => {
    const next = direction === 'next' ? (active + 1) % count : (active - 1 + count) % count;
    scrollToIndex(next);
  };

  return (
    <div
      className={`smart-carousel ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className={`smart-carousel-track ${trackClassName}`.trim()}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go('prev');
          if (event.key === 'ArrowRight') go('next');
        }}
      >
        {children}
      </div>
      <div className="smart-carousel-bar">
        <div className="smart-carousel-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <span className="smart-carousel-count"><strong>{pad(active + 1)}</strong> / {pad(count)}</span>
        <div className="smart-carousel-dots" role="group" aria-label={`${ariaLabel} pagination`}>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === active ? 'is-active' : ''}
              onClick={() => scrollToIndex(index)}
              aria-label={`Show ${itemLabel} ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
        <div className="smart-carousel-arrows">
          <button type="button" onClick={() => go('prev')} aria-label={`Previous ${itemLabel}`}><ArrowLeft size={16} /></button>
          {autoPlay && (
            <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Play carousel' : 'Pause carousel'}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          )}
          <button type="button" onClick={() => go('next')} aria-label={`Next ${itemLabel}`}><ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
