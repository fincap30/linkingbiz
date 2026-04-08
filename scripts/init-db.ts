import { initSchema, seedDemoData } from '../lib/db/schema';

async function main() {
  console.log('Initializing database...');
  await initSchema();
  console.log('Seeding demo data...');
  await seedDemoData();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
