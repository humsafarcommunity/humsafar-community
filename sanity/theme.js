// Humsafar Studio colours: deep green navigation, orange action colour, lime + sunrise accents.
import { buildLegacyTheme } from 'sanity';

const props = {
  '--black': '#10231b',
  '--white': '#ffffff',
  '--gray': '#64748b',
  '--gray-base': '#64748b',

  '--component-bg': '#ffffff',
  '--component-text-color': '#10231b',

  '--brand-primary': '#E8681E',

  '--default-button-color': '#64748b',
  '--default-button-primary-color': '#E8681E',
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#f59e0b',
  '--default-button-danger-color': '#dc2626',

  '--state-info-color': '#0ea5e9',
  '--state-success-color': '#16a34a',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color': '#dc2626',

  '--main-navigation-color': '#064e3b',
  '--main-navigation-color--inverted': '#ffffff',

  '--focus-color': '#E8681E',
};

export const humsafarTheme = buildLegacyTheme(props);
