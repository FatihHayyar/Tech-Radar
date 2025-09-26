const app = require('./app');

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log('API listening on ' + port);
  });
}
