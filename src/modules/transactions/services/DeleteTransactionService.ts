import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ITransactionsRepository, {
  IBalance,
} from '../infra/typeorm/repositories/ITransactionRepository';

interface IRequest {
  id: string;
  user_id: string;
}
@injectable()
class DeleteTransactionService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<void> {
    const transaction = await this.transactionsRepository.findByIdAndUserId(
      user_id,
      id,
    );
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }

    let balance = await this.cacheProvider.recover<IBalance>(
      `balance:${user_id}`,
    );
    if (!balance) {
      balance = await this.transactionsRepository.getBalance(user_id);
    }
    const { total } = balance;
    if (transaction.type === 'income' && total - transaction.value < 0) {
      throw new AppError('You do not have enough balance');
    }
    await this.transactionsRepository.remove(transaction);
    this.cacheProvider.invalidate(`transactions-list:${user_id}`);
    this.cacheProvider.invalidate(`balance:${user_id}`);
  }
}

export default DeleteTransactionService;
