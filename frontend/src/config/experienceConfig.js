export const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

export const shouldUseSmoothScroll = () => (
  typeof window !== 'undefined'
  && !prefersReducedMotion()
  && window.matchMedia
  && window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches
);

export const shouldUseWebGL = () => {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  if (!window.matchMedia || !window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches) return false;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return false;
  return true;
};

export const webglConfig = {
  dpr: [1, 1.5],
  camera: { position: [0, 0.35, 5.2], fov: 38 },
  lazyDelayMs: 4000,
};

export const lenisConfig = {
  duration: 0.72,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1,
};
