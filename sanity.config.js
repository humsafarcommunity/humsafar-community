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
            // Singleton
            S.listItem()
              .title('Global Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Global Site Settings')
              ),
            S.divider(),
            // Manual list to avoid resolution errors
            S.documentTypeListItem('tour').title('Tour Packages'),
            S.documentTypeListItem('blog').title('Blog Posts'),
            S.documentTypeListItem('banner').title('Hero Banners'),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // Filter out singleton types from "Create new" menu
    templates: (prev) =>
      prev.filter((template) => !['siteSettings'].includes(template.id)),
  },
  document: {
    // For singleton types, hide the "Duplicate" and "Delete" actions
    actions: (prev, { schemaType }) => {
      if (schemaType === 'siteSettings') {
        return prev.filter(({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action));
      }
      return prev;
    },
  },
});
