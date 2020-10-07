import TransactionsRepository from '@modules/transactions/repositories/TransactionsRepository';
import CreateTransactionService from '@modules/transactions/services/CreateTransactionService';
import DeleteTransactionService from '@modules/transactions/services/DeleteTransactionService';
import ListTransactionService from '@modules/transactions/services/ListTransactionsService';
import UpdateTransactionService from '@modules/transactions/services/UpdateTransactionService';
import log from '@shared/utils/log';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { getCustomRepository } from 'typeorm';

class TransactionsController {
  async index(request: Request, response: Response): Promise<Response> {
    const listTransaction = container.resolve(ListTransactionService);
    const { transactions, balance } = await listTransaction.execute(
      request.user.id,
    );
    return response.json({ transactions, balance });
  }

  async show(request: Request, response: Response): Promise<Response> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const { id } = request.params;
    const transaction = await transactionRepository.findByIdAndUserId(
      request.user.id,
      id,
    );
    return response.json(transaction);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { title, value, type, category } = request.body;
    const createTransaction = container.resolve(CreateTransactionService);
    log.warn(request.user.id);
    const transaction = await createTransaction.execute({
      user: request.user.id,
      title,
      value,
      type,
      category,
    });
    return response.json(transaction);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { title, value, type, category } = request.body;
    const { id } = request.user;
    const updateTransaction = container.resolve(UpdateTransactionService);
    const transaction = await updateTransaction.execute({
      title,
      value,
      type,
      category,
      id: request.params.id,
      user: id,
    });
    return response.status(204).json(transaction);
  }

  async destroy(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteTransaction = container.resolve(DeleteTransactionService);
    await deleteTransaction.execute({ id, user_id: request.user.id });
    return response.status(204).send();
  }
}

export default TransactionsController;
