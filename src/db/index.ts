import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Creates or opens the drizzle.db file
const sqlite = new Database('drizzle.db');

export const db = drizzle(sqlite, { schema });