import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import sessionsRouter from './sessions.routes';
import transactionsRouter from './transactions.routes';
import usersRouter from './users.routes';

const router = Router();

router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use(ensureAuthenticated);
router.use('/transactions', transactionsRouter);
export default router;
