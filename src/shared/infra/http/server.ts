import log from '@shared/utils/log';
import app from './app';

app.listen(3333, () => {
  log.info('🚀 Server started on port 3333!');
});
