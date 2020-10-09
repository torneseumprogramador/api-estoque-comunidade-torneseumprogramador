import TransactionsController from '@controllers/TransactionsControllers';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

const transactionsRouter = Router();
const transactionsController = new TransactionsController();
transactionsRouter.get('/', transactionsController.index);
transactionsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required().uuid(),
    },
  }),
  transactionsController.show,
);
transactionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      category: Joi.string().required(),
      value: Joi.number().required(),
      type: Joi.string().valid('income', 'outcome'),
      date: Joi.date().required(),
    },
  }),
  transactionsController.create,
);
transactionsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required().uuid(),
    },

    [Segments.BODY]: {
      title: Joi.string().required(),
      category: Joi.string().required(),
      value: Joi.number().required(),
      type: Joi.string().valid('income', 'outcome'),
      date: Joi.date().required(),
    },
  }),
  transactionsController.update,
);
transactionsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required().uuid(),
    },
  }),
  transactionsController.destroy,
);

export default transactionsRouter;
