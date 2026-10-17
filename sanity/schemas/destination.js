// Destination cards on the homepage ("Domestic Destinations" / "International Destinations").
// If you add none, the homepage builds cards automatically from your tours.
export default {
  name: 'destination',
  title: 'Destination Card',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string', description: 'Shown on the card, e.g. Himachal', validation: (Rule) => Rule.required() },
    {
      name: 'group',
      title: 'Section',
      type: 'string',
      options: { list: [{ title: 'Domestic Destinations', value: 'domestic' }, { title: 'International Destinations', value: 'international' }], layout: 'radio' },
      initialValue: 'domestic',
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Tall (portrait) photos look best, about 800 × 1200. Keep the top of the photo calm so the name is easy to read.',
      validation: (Rule) => Rule.required(),
      fields: [{ name: 'alt', title: 'Describe the photo', type: 'string' }],
    },
    {
      name: 'textColor',
      title: 'Name colour',
      type: 'string',
      options: { list: [{ title: 'White (dark photo)', value: 'light' }, { title: 'Dark blue (bright or snowy photo)', value: 'dark' }], layout: 'radio' },
      initialValue: 'light',
    },
    {
      name: 'region',
      title: 'Opens which tours',
      type: 'string',
      description: 'Tapping the card shows tours from this region.',
      options: { list: [{ title: 'Himachal', value: 'himachal' }, { title: 'Uttarakhand', value: 'uttarakhand' }, { title: 'Rajasthan', value: 'rajasthan' }, { title: 'International', value: 'international' }, { title: 'Rest of India', value: 'other' }] },
    },
    { name: 'link', title: 'Or a custom link', type: 'string', description: 'Optional. A page on this site such as /packages/spiti-full-circuit. Overrides the choice above.' },
    { name: 'order', title: 'Order', type: 'number', description: 'Smaller numbers come first.' },
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'group', media: 'image' } },
};
