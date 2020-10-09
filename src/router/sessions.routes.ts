import SessionsControllers from '@controllers/SessionsControllers';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

const sessionsRouter = Router();
const sessionsController = new SessionsControllers();
sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
