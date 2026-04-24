import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

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
            // Singleton for Site Settings
            S.listItem()
              .title('Global Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            // Other types
            ...S.documentTypeListItems().filter(
              (listItem) => !['siteSettings'].includes(listItem.getId())
            ),
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
        return prev.filter(({ action }) => !['delete', 'duplicate'].includes(action));
      }
      return prev;
    },
  },
});
