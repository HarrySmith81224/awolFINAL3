'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

//sanity studio at /admin
export default function AdminPage() {
  return <NextStudio config={config} />;
}
