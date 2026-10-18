export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    { name: 'business', title: 'Business Details', options: { collapsible: true } },
    { name: 'footer', title: 'Footer & Newsletter', options: { collapsible: true } },
    { name: 'stats', title: 'Traveler Statistics', options: { collapsible: true } },
    { name: 'social', title: 'Social Media Icons', options: { collapsible: true } },
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
    { name: 'instagramFollowers', title: 'Instagram followers', type: 'string', description: 'Shown under the hero, e.g. 13,000+. Leave empty to hide.', fieldset: 'stats' },
    { name: 'reviewCount', title: 'Total Reviews', type: 'string', fieldset: 'stats' },
    { name: 'googleReviewsUrl', title: 'Google reviews link', type: 'url', description: 'Optional. Link to your Google Business reviews.', fieldset: 'stats' },
    { name: 'ratingValue', title: 'Google rating', type: 'string', description: 'Shown under the hero, e.g. 4.9. Leave empty to hide.', fieldset: 'stats' },
    { name: 'totalTravelers', title: 'Total Travellers', type: 'string', description: 'Shown under the hero, e.g. 10,000+. Leave empty to hide.', fieldset: 'stats' },

    { name: 'gst', title: 'GST Number', type: 'string', fieldset: 'business' },
    { name: 'location', title: 'Base City', type: 'string', fieldset: 'business' },
    
    {
      name: 'trustHeading',
      title: 'Logo strip heading',
      type: 'string',
      description: 'Shown above the logos at the bottom of every page. Default: Brands who trust us',
      fieldset: 'footer'
    },
    {
      name: 'trustLogos',
      title: 'Logo strip (registrations and partners)',
      type: 'array',
      description: 'Only add organisations you are actually registered with or listed on, using their official logo.',
      fieldset: 'footer',
      of: [
        {
          type: 'object',
          name: 'trustLogo',
          fields: [
            { name: 'name', title: 'Name', type: 'string', description: 'e.g. TripAdvisor', validation: (Rule) => Rule.required() },
            { name: 'logo', title: 'Logo', type: 'image', validation: (Rule) => Rule.required() },
            { name: 'url', title: 'Link (optional)', type: 'url', description: 'Your listing or certificate page' },
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
    },
    {
      name: 'faqs',
      title: 'Homepage FAQs',
      type: 'array',
      of: [{ type: 'faq' }],
      fieldset: 'footer'
    },
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
        { name: 'linkedin', type: 'url' },
      ],
    },
  ],
};
