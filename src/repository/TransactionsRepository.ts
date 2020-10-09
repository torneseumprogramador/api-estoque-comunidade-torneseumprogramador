import Transaction from '@models/Transaction';
import { EntityRepository, Repository } from 'typeorm';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(id: string): Promise<Balance> {
    const transactions = await this.find({
      where: {
        user_id: id,
      },
    });
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
