import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import brand from '../config/brandConfig';
import { absoluteAssetUrl } from '../utils/assetUrl';

export default function SeoHead({
  title,
  description,
  canonical,
  image,
  noindex = false,
  structuredData,
  type = 'website',
  keywords,
}) {
  const location = useLocation();
  const finalTitle = title || brand.defaultSEO.title;
  const finalDescription = description || brand.defaultSEO.description;
  const hashPath = `${location.pathname}${location.search}`;
  const finalCanonical = canonical || `${brand.website}/#${hashPath === '/' ? '' : hashPath}`;
  const finalImage = absoluteAssetUrl(image || 'assets/fleet/hero-red-sedan.webp');
  const finalKeywords = keywords || 'car rental, Pakistan, Lahore, Islamabad, premium cars, SUV rental, luxury car rental, monthly rental, airport transfer, corporate car rental';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={brand.brandName} />
      <meta property="og:locale" content="en_PK" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content={brand.brandName} />

      {/* Additional SEO */}
      <meta name="author" content={brand.brandName} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1'} />
      <meta httpEquiv="content-language" content="en" />
      <meta name="geo.region" content="PK" />
      <meta name="geo.placename" content="Lahore" />

      {/* Favicon */}
      <link rel="icon" type="image/png" href={brand.favicon} />
      <link rel="apple-touch-icon" href={brand.appleTouchIcon} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}
