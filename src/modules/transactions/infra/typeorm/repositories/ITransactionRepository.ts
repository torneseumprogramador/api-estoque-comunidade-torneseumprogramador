import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';
import Transaction from '../entities/Transaction';

export interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

export default interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
  getBalance(id: string): Promise<IBalance>;
  findByUserId(user_id: string): Promise<Transaction[]>;
  findOneByUserId(user_id: string): Promise<Transaction | undefined>;
  findByIdAndUserId(
    user_id: string,
    id: string,
  ): Promise<Transaction | undefined>;
  remove(transaction: Transaction): Promise<void>;
}
