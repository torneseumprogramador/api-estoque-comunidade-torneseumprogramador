import AppError from '@errors/AppError';
import { Request, Response } from 'express';
import log from 'src/logger';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repository/TransactionsRepository';

export default class TransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { title, category, value, type, date } = request.body;

    const { total } = await transactionsRepository.getBalance(request.user.id);
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    const transaction = transactionsRepository.create({
      title,
      category,
      value,
      type,
      date,
      user_id: request.user.id,
    });
    await transactionsRepository.save(transaction);
    return response.status(201).json({ transaction });
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find({
      where: {
        user_id: request.user.id,
      },
    });
    const balance = await transactionsRepository.getBalance(request.user.id);
    return response.json({ transactions, balance });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { title, category, type, value, date } = request.body;
    const { id } = request.params;
    const { total } = await transactionsRepository.getBalance(request.user.id);
    const transaction = await transactionsRepository.findOne({
      where: {
        id,
        user_id: request.user.id,
      },
    });
    if (!transaction) {
      throw new AppError('There is no user with that transaction');
    }
    if (
      (type === 'outcome' &&
        transaction.type === 'income' &&
        total - transaction.value < value) ||
      (type === 'outcome' &&
        transaction.type === 'outcome' &&
        total + transaction.value < value) ||
      (type === 'income' &&
        transaction.type === 'income' &&
        total - transaction.value > value)
    ) {
      throw new AppError('You do not have enough balance');
    }
    transaction.title = title;
    transaction.value = value;
    transaction.type = type;
    transaction.date = date;
    transaction.category = category;
    await transactionsRepository.save(transaction);
    return response.status(204).json({ transaction });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const { id } = request.params;
    const transaction = await transactionsRepository.findOne({
      where: {
        user_id: request.user.id,
        id,
      },
    });
    return response.json({ transaction });
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.find({
      where: {
        user_id: request.user.id,
        id,
      },
    });
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }
    await transactionsRepository.remove(transaction);
    return response.status(204).send();
  }
}
