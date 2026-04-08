import { initSchema, seedDemoData } from '../lib/db/schema';

console.log('Initializing database...');
initSchema();
console.log('Seeding demo data...');
seedDemoData();
console.log('Done!');
