import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Use a fixed path that works in both dev and production
    // In production/VPS, use /tmp for SQLite (writable in most environments)
    const dataDir = process.env.SQLITE_DIR || '/tmp';
    const dbPath = join(dataDir, 'linkingbiz.sqlite');
    
    // Ensure the directory exists
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
