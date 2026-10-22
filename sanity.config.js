import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas/index.js';

export default defineConfig({
  basePath: '/admin',
  projectId: 'fghdctku',
  dataset: 'production',
  title: 'Humsafar CMS',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items([
            // Singleton for Branding
            S.listItem()
              .title('Global Branding')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Global Branding')
              ),
            // Singleton for SEO
            S.listItem()
              .title('SEO & Metadata')
              .id('seoSettings')
              .child(
                S.document()
                  .schemaType('seoSettings')
                  .documentId('seoSettings')
                  .title('SEO & Metadata')
              ),
            // Singleton for the About Us page
            S.listItem()
              .title('About Us Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
                  .title('About Us Page')
              ),
            S.divider(),
            // Manual list to avoid resolution errors
            S.documentTypeListItem('tour').title('Tour Packages'),
            S.documentTypeListItem('blog').title('Blog Posts'),
            S.documentTypeListItem('banner').title('Hero Banners'),
            S.documentTypeListItem('destination').title('Destination Cards'),
            S.divider(),
            S.documentTypeListItem('lead').title('Leads (callback requests)'),
            S.documentTypeListItem('review').title('Reviews'),
            S.documentTypeListItem('video').title('Videos (homepage)'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Filter out singleton types from "Create new" menu
    templates: (prev) =>
      prev.filter((template) => !['siteSettings', 'seoSettings', 'aboutPage'].includes(template.id)),
  },
  document: {
    // For singleton types, hide the "Duplicate" and "Delete" actions
    actions: (prev, { schemaType }) => {
      if (['siteSettings', 'seoSettings', 'aboutPage'].includes(schemaType)) {
        return prev.filter(({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action));
      }
      return prev;
    },
  },
});
