import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import useInView from './useInView';
import { prefersReducedMotion } from '../config/experienceConfig';

/**
 * Scroll-reveal wrapper.
 * anim: fade | up | down | left | right | slide | scale | zoom | image
 */
export function Reveal({
  as: Tag = 'div',
  anim = 'up',
  delay = 0,
  duration,
  className = '',
  children,
  ...rest
}) {
  const ref = useInView();
  const style = { ...rest.style };
  if (delay) style['--delay'] = `${delay}s`;
  if (duration) style['--dur'] = `${duration}s`;
  return (
    <Tag ref={ref} className={`anim anim-${anim} ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Staggered entrance for card grids.
 * Clones direct children and assigns incremental `--delay` values.
 */
export function Stagger({
  as: Tag = 'div',
  className = '',
  anim = 'up',
  delay = 0,
  step = 0.09,
  children,
  ...rest
}) {
  const ref = useInView();
  const items = Children.toArray(children);
  return (
    <Tag ref={ref} className={`stagger-group is-anim-${anim} ${className}`.trim()} {...rest}>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const childStyle = { ...(child.props.style || {}), '--delay': `${(delay + i * step).toFixed(3)}s` };
        return cloneElement(child, {
          key: child.key ?? i,
          className: `${child.props.className || ''} stag-item`.trim(),
          style: childStyle,
        });
      })}
    </Tag>
  );
}

/**
 * Word-by-word masked text reveal.
 */
export function TextReveal({
  as: Tag = 'h2',
  text,
  className = '',
  delay = 0,
  step = 0.045,
  children,
  ...rest
}) {
  const ref = useInView();
  const content = text ?? children;
  let index = 0;

  const renderWord = (word) => {
    const i = index;
    index += 1;
    return (
      <span className="tr-mask" key={`${word}-${i}`}>
        <span className="tr-word" style={{ '--delay': `${(delay + i * step).toFixed(3)}s` }}>{word}</span>
      </span>
    );
  };

  const words = typeof content === 'string' ? content.split(/\s+/).filter(Boolean) : null;

  return (
    <Tag ref={ref} className={`text-reveal ${className}`.trim()} {...rest}>
      {words
        ? words.map((word, i) => (
            <span className="tr-clip" key={`${word}-${i}`}>
              {renderWord(word)}{' '}
            </span>
          ))
        : content}
    </Tag>
  );
}

/**
 * Clip-path image reveal with a subtle inner zoom settle.
 */
export function ImageReveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useInView();
  const style = { ...rest.style };
  if (delay) style['--delay'] = `${delay}s`;
  return (
    <Tag ref={ref} className={`anim anim-image ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Scroll-linked parallax translate (disabled for reduced motion).
 * speed: 0.1–0.6 typical. Positive moves element opposite to scroll feel.
 */
export function Parallax({ as: Tag = 'div', speed = 0.25, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < -240 || rect.top > vh + 240) return;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const offset = -progress * speed * 120;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [speed]);

  return (
    <Tag ref={ref} className={`parallax ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Eased count-up animation triggered when scrolled into view.
 */
export function Counter({
  to = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  ...rest
}) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0));
  const rafStarted = useRef(false);

  const ref = useInView({
    onEnter: () => {
      if (rafStarted.current) return;
      rafStarted.current = true;
      if (prefersReducedMotion()) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const total = Math.max(duration, 0.4) * 1000;
      const tick = (now) => {
        const p = Math.min((now - start) / total, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(to * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
  });

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');

  return (
    <span ref={ref} className={`counter ${className}`.trim()} {...rest}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default Reveal;
