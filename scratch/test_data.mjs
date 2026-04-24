import { getFreshData } from '../data/index.js';
try {
  const data = await getFreshData();
  console.log('SUCCESS');
} catch (e) {
  console.error(e);
  process.exit(1);
}
