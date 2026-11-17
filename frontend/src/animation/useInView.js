import { useEffect, useRef } from 'react';

/**
 * Shared IntersectionObserver hook powering the scroll-reveal system.
 * Adds `.is-inview` to the referenced element when it enters the viewport.
 */
export default function useInView(options = {}) {
  const { once = true, amount = 0.18, rootMargin = '0px 0px -6% 0px', onEnter } = options;
  const ref = useRef(null);
  const enteredRef = useRef(false);
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reveal = () => {
      el.classList.add('is-inview');
      if (!enteredRef.current) {
        enteredRef.current = true;
        if (onEnterRef.current) onEnterRef.current(el);
      }
    };

    if (typeof IntersectionObserver === 'undefined') {
      reveal();
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            if (once) io.disconnect();
          } else if (!once) {
            el.classList.remove('is-inview');
            enteredRef.current = false;
          }
        });
      },
      { threshold: amount, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, amount, rootMargin]);

  return ref;
}
