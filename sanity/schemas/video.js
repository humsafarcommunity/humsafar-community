// A YouTube video shown in the "Videos" carousel on the homepage.
export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', description: 'Shown under the video, e.g. "Spiti Valley group trip 2026".', validation: (R) => R.required() },
    { name: 'youtubeUrl', title: 'YouTube link', type: 'url', description: 'Paste any YouTube link: normal video, Short or youtu.be link.', validation: (R) => R.required() },
    { name: 'thumbnail', title: 'Cover photo (optional)', type: 'image', options: { hotspot: true }, description: 'Leave empty to use the YouTube thumbnail.' },
    { name: 'order', title: 'Order', type: 'number', description: 'Smaller numbers come first.' },
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', subtitle: 'youtubeUrl', media: 'thumbnail' } },
};
