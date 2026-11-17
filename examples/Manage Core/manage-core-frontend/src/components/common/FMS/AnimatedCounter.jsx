import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ value, duration = 800, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
    if (isNaN(numVal)) { setCount(0); return; }
    const startTime = performance.now();
    let animId;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(numVal * eased);
      if (progress < 1) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);
  if (isNaN(parseFloat(String(value).replace(/[^0-9.-]/g, '')))) return <span>{value}</span>;
  const formatted = count.toFixed(decimals);
  return <span>{prefix}{Number(formatted).toLocaleString()}{suffix}</span>;
};

export default AnimatedCounter;
