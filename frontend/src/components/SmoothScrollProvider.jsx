import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenisConfig, shouldUseSmoothScroll } from '../config/experienceConfig';

export default function SmoothScrollProvider() {
  useEffect(() => {
    if (!shouldUseSmoothScroll()) return undefined;

    const lenis = new Lenis(lenisConfig);
    let frameId;

    // Add lenis class to html element for CSS hooks
    document.documentElement.classList.add('lenis');
    document.documentElement.classList.add('lenis-smooth');

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  return null;
}
