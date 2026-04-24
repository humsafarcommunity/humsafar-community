const { getFreshData } = require('./data/index');
getFreshData().then(data => {
  console.log('Data fetched successfully');
  console.log('TOURS count:', data.TOURS.length);
}).catch(err => {
  console.error('FAILED TO FETCH DATA:', err);
  process.exit(1);
});
