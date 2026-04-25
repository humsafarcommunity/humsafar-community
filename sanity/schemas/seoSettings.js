export default {
  name: 'seoSettings',
  title: 'SEO & Metadata',
  type: 'document',
  fieldsets: [
    { name: 'primary', title: 'Main Meta Tags' },
    { name: 'social', title: 'Open Graph & Social Sharing' },
    { name: 'advanced', title: 'Advanced & Assets' }
  ],
  fields: [
    { 
      name: 'seoTitle', 
      title: 'Default Meta Title', 
      type: 'string', 
      description: 'The fallback title for pages without a specific title.',
      fieldset: 'primary' 
    },
    { 
      name: 'seoDescription', 
      title: 'Default Meta Description', 
      type: 'text', 
      description: 'The fallback description for Google and other search engines.',
      fieldset: 'primary' 
    },
    { 
      name: 'seoKeywords', 
      title: 'Global Keywords', 
      type: 'string', 
      description: 'Comma separated keywords (e.g. Travel, India, Trekking)',
      fieldset: 'primary' 
    },
    {
      name: 'ogImage',
      title: 'Global Share Image',
      type: 'image',
      description: 'The image shown when the site link is shared on WhatsApp/Facebook.',
      options: { hotspot: true },
      fieldset: 'social'
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Upload a square icon (PNG or ICO) for the browser tab.',
      fieldset: 'advanced'
    },
    {
      name: 'googleVerification',
      title: 'Google Search Console Code',
      type: 'string',
      description: 'The verification code from Google Search Console.',
      fieldset: 'advanced'
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL Base',
      type: 'url',
      description: 'e.g. https://www.humsafarcommunity.com',
      fieldset: 'advanced'
    }
  ],
};
