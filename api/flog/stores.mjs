// FLOG API storage: one record (a swimmer's preferences and swims) per
// visitor and swimmer, under a key like "<visitor>/<swimmer>". Three
// adapters with the same three calls: memory (tests), a JSON file per key
// (the local dev server) and Netlify Blobs (netlify/functions/flog.mjs).
import fs from 'node:fs/promises';
import path from 'node:path';

export function memoryStore() {
  const data = new Map();
  return {
    async get(key) {
      return data.has(key) ? structuredClone(data.get(key)) : null;
    },
    async set(key, record) {
      data.set(key, structuredClone(record));
    },
    async delete(key) {
      data.delete(key);
    }
  };
}

// Keys are checked by the handler (letters, digits, dashes and one slash),
// so they're safe as file paths
export function fileStore(dir) {
  const file = key => path.join(dir, key + '.json');
  return {
    async get(key) {
      try {
        return JSON.parse(await fs.readFile(file(key), 'utf8'));
      } catch (e) {
        if (e.code === 'ENOENT') return null;
        throw e;
      }
    },
    async set(key, record) {
      await fs.mkdir(path.dirname(file(key)), { recursive: true });
      await fs.writeFile(file(key), JSON.stringify(record));
    },
    async delete(key) {
      await fs.rm(file(key), { force: true });
    }
  };
}

// store: a Netlify Blobs store (getStore('flog'))
export function blobsStore(store) {
  return {
    async get(key) {
      return (await store.get(key, { type: 'json' })) ?? null;
    },
    async set(key, record) {
      await store.setJSON(key, record);
    },
    async delete(key) {
      await store.delete(key);
    }
  };
}
