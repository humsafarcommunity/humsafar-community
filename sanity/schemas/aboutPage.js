// About Us page — a single document, edited in Sanity Studio under "About Us Page".
// Every field is optional: anything left empty falls back to the default text in pages/about.jsx.
export default {
  name: 'aboutPage',
  title: 'About Us Page',
  type: 'document',
  fieldsets: [
    { name: 'seo', title: 'Search & Sharing', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    { name: 'eyebrow', title: 'Small label above the headline', type: 'string', description: 'e.g. Our Story' },
    {
      name: 'headline',
      title: 'Headline',
      type: 'text',
      rows: 2,
      description: 'The big title at the top. Press Enter for a line break.',
    },
    { name: 'intro', title: 'Intro paragraph', type: 'text', rows: 4 },
    {
      name: 'heroImage',
      title: 'Hero photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Wide photo shown under the intro (a trip group photo works well). Leave empty to hide it.',
      fields: [{ name: 'alt', title: 'Describe the photo', type: 'string' }],
    },
    {
      name: 'stats',
      title: 'Numbers',
      type: 'array',
      description: 'Short facts such as "50,000+ Travelers". Up to 4 look best.',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          name: 'stat',
          fields: [
            { name: 'value', title: 'Number', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    },
    {
      name: 'storyTitle',
      title: 'Story heading',
      type: 'string',
    },
    {
      name: 'story',
      title: 'Our story',
      type: 'text',
      rows: 10,
      description: 'Leave a blank line between paragraphs.',
    },
    {
      name: 'values',
      title: 'What we stand for',
      type: 'array',
      description: 'Shown as cards.',
      of: [
        {
          type: 'object',
          name: 'value',
          fields: [
            { name: 'icon', title: 'Emoji', type: 'string', description: 'One emoji, e.g. 🏔️' },
            { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title', subtitle: 'icon' } },
        },
      ],
    },
    {
      name: 'team',
      title: 'Team',
      type: 'array',
      description: 'Trip captains and founders. Leave empty to hide the section.',
      of: [
        {
          type: 'object',
          name: 'member',
          fields: [
            { name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'role', title: 'Role', type: 'string' },
            { name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } },
          ],
          preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
        },
      ],
    },
    { name: 'teamTitle', title: 'Team heading', type: 'string' },
    { name: 'ctaTitle', title: 'Closing heading', type: 'string', description: 'e.g. Ready to travel with us?' },
    { name: 'ctaText', title: 'Closing text', type: 'text', rows: 2 },
    { name: 'ctaButtonLabel', title: 'Button text', type: 'string' },
    {
      name: 'ctaButtonLink',
      title: 'Button link',
      type: 'string',
      description: 'A page on this site (e.g. /packages) or a full web address.',
    },
    { name: 'seoTitle', title: 'Google title', type: 'string', fieldset: 'seo', validation: (Rule) => Rule.max(70) },
    {
      name: 'seoDescription',
      title: 'Google description',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      validation: (Rule) => Rule.max(170),
    },
    { name: 'ogImage', title: 'Share image', type: 'image', fieldset: 'seo' },
  ],
  preview: { prepare: () => ({ title: 'About Us Page' }) },
};
