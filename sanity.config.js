import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas/index.js';
import { humsafarTheme } from './sanity/theme.js';
import { structure } from './sanity/structure.js';
import { emojiIcon } from './sanity/components/emojiIcon';
import StudioLogo from './sanity/components/StudioLogo';
import HomeTool from './sanity/components/HomeTool';

const SINGLETONS = ['siteSettings', 'seoSettings', 'aboutPage'];

// Emoji icons shown in "Create new", search and document headers
const TYPE_ICONS = {
  tour: '🏔️', blog: '✍️', banner: '🖼️', destination: '📍', lead: '📞', review: '⭐', video: '🎬',
  siteSettings: '🎨', seoSettings: '🔍', aboutPage: '👥',
};

export default defineConfig({
  basePath: '/admin',
  projectId: 'fghdctku',
  dataset: 'production',
  title: 'Humsafar CMS',
  theme: humsafarTheme,
  studio: { components: { logo: StudioLogo } },
  plugins: [
    structureTool({ structure }),
    // Home dashboard first, so it is the page you land on
    {
      name: 'humsafar-home',
      tools: (prev) => [{ name: 'home', title: 'Home', icon: emojiIcon('🏠'), component: HomeTool }, ...prev],
    },
  ],
  schema: {
    types: schemaTypes.map((t) => (TYPE_ICONS[t.name] ? { ...t, icon: emojiIcon(TYPE_ICONS[t.name]) } : t)),
    // Filter out singleton types from "Create new" menu
    templates: (prev) => prev.filter((template) => !SINGLETONS.includes(template.id)),
  },
  document: {
    // For singleton types, hide the "Duplicate" and "Delete" actions
    actions: (prev, { schemaType }) => {
      if (SINGLETONS.includes(schemaType)) {
        return prev.filter(({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action));
      }
      return prev;
    },
  },
});
