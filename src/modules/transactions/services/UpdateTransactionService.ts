import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Transaction from '../infra/typeorm/entities/Transaction';
import Category from '../infra/typeorm/entities/Category';
import ITransactionsRepository, {
  IBalance,
} from '../infra/typeorm/repositories/ITransactionRepository';

interface IRequest {
  id: string;
  user: string;
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}
@injectable()
class UpdateTransactionService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionsRepository,
  ) {}

  public async execute({
    id,
    user,
    category,
    title,
    type,
    value,
  }: IRequest): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let balance = await this.cacheProvider.recover<IBalance>(`balance:${user}`);
    if (!balance) {
      balance = await this.transactionRepository.getBalance(user);
    }
    const { total } = balance;

    const transaction = await this.transactionRepository.findByIdAndUserId(
      user,
      id,
    );

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
        total - transaction.value < 0)
    ) {
      throw new AppError('You do not have enough balance');
    }
    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });
    }
    await categoryRepository.save(transactionCategory);
    transaction.title = title;
    transaction.value = value;
    transaction.type = type;
    transaction.category = transactionCategory;
    await this.transactionRepository.save(transaction);
    this.cacheProvider.invalidate(`balance:${user}`);
    return transaction;
  }
}

export default UpdateTransactionService;
