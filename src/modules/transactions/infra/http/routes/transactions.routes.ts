import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import TransactionsController from '../controllers/TransactionsController';

const transactionsRouter = Router();
const transactionsController = new TransactionsController();
transactionsRouter.get('/', transactionsController.index);
transactionsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  transactionsController.show,
);

transactionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      value: Joi.number(),
      category: Joi.string().required(),
      type: Joi.string().valid('income', 'outcome'),
    },
  }),
  transactionsController.create,
);
transactionsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      value: Joi.number(),
      category: Joi.string().required(),
      type: Joi.string().valid('income', 'outcome'),
    },
  }),
  transactionsController.update,
);

transactionsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  transactionsController.destroy,
);

export default transactionsRouter;
