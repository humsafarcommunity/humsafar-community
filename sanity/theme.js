import { buildLegacyTheme } from 'sanity';

// Humsafar colours for the CMS: forest green and lime, with bright status colours.
export const humsafarTheme = buildLegacyTheme({
  '--black': '#0b1f17',
  '--white': '#ffffff',
  '--gray': '#6b7f76',
  '--gray-base': '#6b7f76',

  '--component-bg': '#f4fbf6',
  '--component-text-color': '#0b1f17',

  '--brand-primary': '#047857',
  '--focus-color': '#10b981',

  '--default-button-color': '#6b7f76',
  '--default-button-primary-color': '#047857',
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#f59e0b',
  '--default-button-danger-color': '#e11d48',

  '--state-info-color': '#0ea5e9',
  '--state-success-color': '#16a34a',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color': '#e11d48',

  '--main-navigation-color': '#022c22',
  '--main-navigation-color--inverted': '#bef264',
});
