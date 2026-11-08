// The FLOG API on Netlify: api/flog/handler.mjs with Netlify Blobs storage
// (store "flog", one record per visitor and swimmer). Served at /api/flog/*
// on the prototype site and on every snapshot; GitHub Pages calls it across
// sites (CORS). docs/flog-mockup.md, docs/api/flog.openapi.yaml.
import { getStore } from '@netlify/blobs';
import { createHandler } from '../../api/flog/handler.mjs';
import { blobsStore } from '../../api/flog/stores.mjs';
import seed from '../../api/flog/seed.mjs';

const ORIGINS = ['https://j-place.github.io', 'http://localhost:8080'];

export default async request => {
  const handle = createHandler({ store: blobsStore(getStore('flog')), seed, origins: ORIGINS });
  return handle(request);
};

export const config = { path: ['/api/flog', '/api/flog/*'] };
