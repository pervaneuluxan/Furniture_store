// Deletes the local database file so the next start recreates it with the
// starter content. Usage: npm run seed --prefix server
import fs from 'node:fs';
import { config } from '../config.js';
import { openDatabase } from './index.js';

for (const suffix of ['', '-wal', '-shm']) fs.rmSync(config.dbPath + suffix, { force: true });

const db = openDatabase(config.dbPath);
const { count } = db.prepare('SELECT COUNT(*) AS count FROM posts').get();
db.close();
console.log(`Database recreated at ${config.dbPath} with ${count} posts.`);
