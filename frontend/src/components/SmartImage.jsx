import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../utils/assetUrl';

const FLEET_ASSET = /^\.?\/?assets\/fleet\/[^?]+\.webp$/i;

export default function SmartImage({
  src,
  alt = '',
  className = '',
  width = 1110,
  height = 700,
  eager = false,
  card = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 640px',
  fallback = 'assets/vehicle-placeholder.svg',
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, [src]);

  const resolved = failed || !src ? fallback : src;
  const hasCardVariant = !failed && card && FLEET_ASSET.test(resolved);
  const cardSource = hasCardVariant ? resolved.replace(/\.webp$/i, '-card.webp') : null;
  const srcSet = cardSource
    ? `${assetUrl(cardSource)} 640w, ${assetUrl(resolved)} 1110w`
    : undefined;

  return (
    <img
      {...rest}
      ref={imageRef}
      src={assetUrl(resolved)}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      className={`smart-image ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setLoaded(true);
        }
      }}
    />
  );
}
