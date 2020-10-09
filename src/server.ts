import app from './app';
import log from './logger';

app.listen(3333, () => {
  log.info(`App running on port 3333`);
});
