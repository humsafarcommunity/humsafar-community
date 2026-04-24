export default {
  name: 'banner',
  title: 'Hero Banner',
  type: 'document',
  fieldsets: [
    { name: 'content', title: 'Banner Text Content' },
    { name: 'visual', title: 'Background Visuals' }
  ],
  fields: [
    { name: 'tag', title: 'Upper Tagline', type: 'string', placeholder: 'e.g. ADVENTURE AWAITS', fieldset: 'content' },
    { name: 'title', title: 'Main Headline', type: 'string', fieldset: 'content' },
    { name: 'hi', title: 'Highlighted Word', type: 'string', description: 'The colored word in the headline', fieldset: 'content' },
    { name: 'sub', title: 'Subtitle Description', type: 'text', fieldset: 'content' },
    { name: 'image', title: 'Background Image', type: 'image', options: { hotspot: true }, fieldset: 'visual' }
  ]
}
