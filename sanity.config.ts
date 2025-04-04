import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './sanity/schemaTypes';

const config = defineConfig({
  projectId: 'zcqx4cns',
  dataset: 'production',
  title: 'awol',
  apiVersion: '2024-08-19',
  basePath: '/admin',
  plugins: [deskTool()],
  schema: { types: schemaTypes },
});

export default config;
