import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect } from 'react';

import { db } from './db';
import migrations from './migrations/migrations';
import { loadStore, useStoreLoaded } from './notes-store';

/** Brings the database schema up to date, then loads the store. True once it is ready. */
export function useDatabase(): boolean {
  const { success, error } = useMigrations(db, migrations);
  const loaded = useStoreLoaded();

  useEffect(() => {
    if (success) loadStore();
  }, [success]);

  // Without its data the app cannot work; let the error screen show it.
  if (error) throw error;
  return loaded;
}
