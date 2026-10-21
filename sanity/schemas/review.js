// Real traveller reviews, shown on the Manali pages and tour pages.
export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    { name: 'author', title: 'Traveller name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'city', title: 'City', type: 'string' },
    { name: 'trip', title: 'Trip', type: 'string', description: 'e.g. Manali Kasol 6D/5N' },
    { name: 'rating', title: 'Rating (1 to 5)', type: 'number', validation: (Rule) => Rule.min(1).max(5), initialValue: 5 },
    { name: 'text', title: 'Review', type: 'text', rows: 4, validation: (Rule) => Rule.required() },
    { name: 'date', title: 'When', type: 'string', description: 'e.g. October 2026' },
    {
      name: 'source',
      title: 'Where it was posted',
      type: 'string',
      options: { list: ['Google', 'Instagram', 'WhatsApp', 'Facebook', 'Other'] },
      description: 'Only add reviews that are real.',
    },
    { name: 'photo', title: 'Traveller photo (optional)', type: 'image', options: { hotspot: true } },
    { name: 'featured', title: 'Show first', type: 'boolean' },
  ],
  preview: { select: { title: 'author', subtitle: 'trip', media: 'photo' } },
};
