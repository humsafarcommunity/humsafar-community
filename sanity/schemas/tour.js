export default {
  name: 'tour',
  title: 'Tour Package',
  type: 'document',
  fields: [
    { name: 'title', title: 'Tour Title', type: 'string' },
    { name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'region', title: 'Region Segment', type: 'string', options: { list: ['himachal', 'uttarakhand', 'rajasthan', 'international', 'other'] } },
    { name: 'type', title: 'Travel Type', type: 'string', options: { list: ['group', 'corporate', 'custom', 'educational'] } },
    {
      name: 'departureDay',
      title: 'Departure day',
      type: 'string',
      description: 'Which day this trip leaves. Customers see the next dates for this day on the booking panel.',
      options: {
        list: [
          { title: 'Saturday', value: 'saturday' },
          { title: 'Friday', value: 'friday' },
          { title: 'Friday and Saturday', value: 'both' },
        ],
        layout: 'radio',
      },
      initialValue: 'saturday',
    },
    { name: 'duration', title: 'Duration (e.g. 6 Days / 5 Nights)', type: 'string' },
    { name: 'price', title: 'Current Price', type: 'number' },
    { name: 'oldPrice', title: 'Old Price (String)', type: 'string' },
    { name: 'img', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    {
      name: 'gallery',
      title: 'Tour Gallery (Multiple Images)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: { layout: 'grid' }
    },
    { name: 'rating', title: 'Rating', type: 'number' },
    { name: 'reviews', title: 'Total Reviews', type: 'number' },
    { name: 'bestseller', title: 'Is Bestseller?', type: 'boolean' },
    { name: 'interested', title: 'People Interested', type: 'number' },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'inclusions', title: 'Inclusions', type: 'array', of: [{ type: 'string' }] },
    { name: 'exclusions', title: 'Exclusions', type: 'array', of: [{ type: 'string' }] },
    { name: 'itinerary', title: 'Itinerary', type: 'array', of: [{ type: 'itineraryDay' }] },
    { name: 'faqs', title: 'FAQs', type: 'array', of: [{ type: 'faq' }] },
    { name: 'advanceAmount', title: 'Advance to book', type: 'string', description: 'e.g. ₹2,000 per person. Shown on the tour page.', group: 'terms' },
    { name: 'taxNote', title: 'Tax note', type: 'string', description: 'e.g. GST included, or GST extra', group: 'terms' },
    { name: 'cancellationPolicy', title: 'Cancellation and refunds', type: 'text', rows: 4, description: 'Plain words, e.g. 100% refund 15 days before, 50% 7 days before.', group: 'terms' },
    { name: 'weatherNote', title: 'Snow and road closure note', type: 'text', rows: 3, description: 'What happens if snow or landslides close the road.', group: 'terms' },
    { name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo' },
    { name: 'seoDesc', title: 'SEO Description', type: 'text', group: 'seo' },
    { name: 'keywords', title: 'SEO Keywords', type: 'string', group: 'seo' },
    { name: 'directAnswer', title: 'AEO Direct Answer Summary', type: 'text', group: 'seo' }
  ],
  groups: [
    { name: 'terms', title: 'Booking terms' },
    { name: 'seo', title: 'SEO / AEO Optimization' }
  ]
}
