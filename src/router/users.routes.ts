import UsersController from '@controllers/UsersControllers';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

const usersRouter = Router();
const usersControllers = new UsersController();
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    },
  }),
  usersControllers.create,
);

export default usersRouter;
