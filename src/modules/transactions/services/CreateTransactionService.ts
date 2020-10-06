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
  user: string;
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}
@injectable()
class CreateTransactionService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionsRepository,
  ) {}

  public async execute({
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
    if (type === 'outcome' && total < value) {
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
    const transaction = this.transactionRepository.create({
      user_id: user,
      title,
      type,
      value,
      category: transactionCategory,
    });
    this.cacheProvider.invalidate(`transactions-list:${user}`);
    this.cacheProvider.invalidate(`balance:${user}`);
    return transaction;
  }
}

export default CreateTransactionService;
