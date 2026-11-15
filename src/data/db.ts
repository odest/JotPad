import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const client = openDatabaseSync('jotpad.db');
// SQLite leaves foreign keys off per connection; the cascades in the schema need them.
client.execSync('PRAGMA foreign_keys = ON;');

export const db = drizzle(client, { schema });
