import { emojiIcon } from './components/emojiIcon';

const single = (S, id, title, emoji) =>
  S.listItem().title(title).id(id).icon(emojiIcon(emoji)).child(S.document().schemaType(id).documentId(id).title(title));

const list = (S, type, title, emoji, children) =>
  S.listItem()
    .title(title)
    .icon(emojiIcon(emoji))
    .child(children || S.documentTypeList(type).title(title));

const filtered = (S, title, emoji, filter, params = {}) =>
  S.listItem().title(title).icon(emojiIcon(emoji)).child(S.documentList().title(title).filter(filter).params(params));

// Left-hand menu: flat, grouped with dividers, emoji icons and handy filtered lists.
export const structure = (S) =>
  S.list()
    .title('Humsafar CMS')
    .items([
      // Trips & content
      list(S, 'tour', 'Tour Packages', '🏔️', S.list().title('Tour Packages').items([
        S.documentTypeListItem('tour').title('All tours').icon(emojiIcon('🏔️')),
        filtered(S, 'Bestsellers', '🔥', '_type == "tour" && bestseller == true'),
        filtered(S, 'Himachal', '⛰️', '_type == "tour" && region == "himachal"'),
        filtered(S, 'Uttarakhand', '🛕', '_type == "tour" && region == "uttarakhand"'),
        filtered(S, 'Rajasthan', '🐪', '_type == "tour" && region == "rajasthan"'),
        filtered(S, 'International', '✈️', '_type == "tour" && region == "international"'),
      ])),
      list(S, 'blog', 'Blog Posts', '✍️'),
      list(S, 'destination', 'Destination Cards', '📍'),
      list(S, 'banner', 'Hero Banners', '🖼️'),
      list(S, 'video', 'Videos (homepage)', '🎬'),
      S.divider(),
      // Customers
      list(S, 'lead', 'Leads (callback requests)', '📞', S.list().title('Leads').items([
        filtered(S, 'New (call these first)', '🆕', '_type == "lead" && (status == "new" || !defined(status))'),
        filtered(S, 'Contacted', '📞', '_type == "lead" && status == "contacted"'),
        filtered(S, 'Booked', '✅', '_type == "lead" && status == "booked"'),
        filtered(S, 'Not interested', '❌', '_type == "lead" && status == "lost"'),
        S.documentTypeListItem('lead').title('All leads').icon(emojiIcon('📋')),
      ])),
      list(S, 'review', 'Reviews', '⭐'),
      S.divider(),
      // Look & settings
      single(S, 'siteSettings', 'Global Branding', '🎨'),
      single(S, 'seoSettings', 'SEO & Metadata', '🔍'),
      single(S, 'aboutPage', 'About Us Page', '👥'),
    ]);
