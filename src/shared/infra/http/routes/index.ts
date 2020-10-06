import transactionsRouter from '@modules/transactions/infra/http/routes/transactions.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const router = Router();

router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use(ensureAuthenticated);
router.use('/transactions', transactionsRouter);
export default router;
