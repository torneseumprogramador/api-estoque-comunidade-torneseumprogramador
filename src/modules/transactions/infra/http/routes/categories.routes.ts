import AppError from '@shared/errors/AppError';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { getRepository } from 'typeorm';
import Category from '../../typeorm/entities/Category';

const categoriesRouter = Router();

categoriesRouter.get('/', async (_request, response) => {
  const categoriesRepository = getRepository(Category);
  const categories = await categoriesRepository.find();
  return response.json({ categories });
});
categoriesRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  async (request, response) => {
    const { id } = request.params;
    const categoriesRepository = getRepository(Category);
    const category = await categoriesRepository.findOne(id);
    if (!category) {
      throw new AppError('Category does not exist', 404);
    }
    return response.status(204).json(category);
  },
);

export default categoriesRouter;
