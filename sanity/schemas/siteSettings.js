export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'business', title: 'Business Details', options: { collapsible: true } },
    { name: 'footer', title: 'Footer & Newsletter', options: { collapsible: true } },
    { name: 'stats', title: 'Traveler Statistics', options: { collapsible: true } },
    { name: 'social', title: 'Social Media Icons', options: { collapsible: true } },
    { name: 'seo', title: 'SEO & Global Branding', options: { collapsible: true } },
  ],
  fields: [
    { name: 'name', title: 'Site Name', type: 'string', fieldset: 'business' },
    { name: 'url', title: 'Site URL', type: 'url', fieldset: 'business' },
    { name: 'phone', title: 'Phone Number', type: 'string', fieldset: 'business' },
    { name: 'whatsapp', title: 'WhatsApp Number', type: 'string', description: 'Country code + num, e.g. 916268496389', fieldset: 'business' },
    { name: 'email', title: 'Email Address', type: 'string', fieldset: 'business' },
    { name: 'address', title: 'Physical Address', type: 'text', fieldset: 'business' },
    
    { name: 'description', title: 'Footer Description', type: 'text', fieldset: 'footer' },
    { name: 'newsletterCount', title: 'Subscriber Count', type: 'string', placeholder: 'e.g. 20,000+', fieldset: 'footer' },
    { name: 'newsletterTitle', title: 'Newsletter Title', type: 'string', fieldset: 'footer' },
    { name: 'newsletterSub', title: 'Newsletter Subtitle', type: 'string', fieldset: 'footer' },

    { name: 'founded', title: 'Year Founded', type: 'string', fieldset: 'stats' },
    { name: 'reviewCount', title: 'Total Reviews', type: 'string', fieldset: 'stats' },
    { name: 'ratingValue', title: 'Avg Rating', type: 'string', fieldset: 'stats' },
    { name: 'totalTravelers', title: 'Total Travelers', type: 'string', fieldset: 'stats' },

    { name: 'gst', title: 'GST Number', type: 'string', fieldset: 'business' },
    { name: 'location', title: 'Base City', type: 'string', fieldset: 'business' },
    
    {
      name: 'faqs',
      title: 'Homepage FAQs',
      type: 'array',
      of: [{ type: 'faq' }],
      fieldset: 'seo'
    },
    { name: 'defaultOGImage', title: 'SEO OG Image', type: 'image', options: { hotspot: true }, fieldset: 'seo' },
    {
      name: 'socials',
      title: 'Active Social Profiles',
      type: 'object',
      fieldset: 'social',
      fields: [
        { name: 'instagram', type: 'url' },
        { name: 'facebook', type: 'url' },
        { name: 'youtube', type: 'url' },
        { name: 'twitter', type: 'url' },
      ],
    },
  ],
};
