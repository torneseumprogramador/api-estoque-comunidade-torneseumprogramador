import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { inject, injectable } from 'tsyringe';
import Transaction from '../infra/typeorm/entities/Transaction';
import ITransactionsRepository, {
  IBalance,
} from '../infra/typeorm/repositories/ITransactionRepository';

interface IResponse {
  transactions: Transaction[];
  balance: IBalance;
}
@injectable()
export default class ListTransactionService {
  constructor(
    @inject('CacheProvider')
    private cacheClient: ICacheProvider,
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionsRepository,
  ) {}

  public async execute(user_id: string): Promise<IResponse> {
    let transactions = await this.cacheClient.recover<Transaction[]>(
      `transactions-list:${user_id}`,
    );
    if (!transactions) {
      transactions = await this.transactionRepository.findByUserId(user_id);
      this.cacheClient.save(`transactions-list:${user_id}`, transactions);
    }
    let balance = await this.cacheClient.recover<IBalance>(
      `balance:${user_id}`,
    );
    if (!balance) {
      balance = await this.transactionRepository.getBalance(user_id);
      this.cacheClient.save(`balance:${user_id}`, balance);
    }
    return { transactions, balance };
  }
}
