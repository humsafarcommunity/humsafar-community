import { createImageUrlBuilder } from '@sanity/image-url';

const builder = createImageUrlBuilder({
  projectId: 'fghdctku',
  dataset: 'production',
});

/**
 * Generates an optimized Sanity image URL with default quality and format settings.
 * @param {object|string} source - The Sanity image source object or string URL
 * @returns {string} Optimized URL
 */
export function urlFor(source) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  try {
    return builder.image(source).auto('format').quality(75).url();
  } catch (err) {
    return typeof source === 'string' ? source : '';
  }
}

/**
 * Returns a builder instance for more complex transformations.
 */
export function imageBuilder(source) {
  if (!source) return null;
  try {
    return builder.image(source);
  } catch (err) {
    return null;
  }
}

