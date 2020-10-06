import { EntityRepository, getRepository, Repository } from 'typeorm';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';
import Transaction from '../infra/typeorm/entities/Transaction';
import ITransactionsRepository, {
  IBalance,
} from '../infra/typeorm/repositories/ITransactionRepository';

@EntityRepository(Transaction)
class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async getBalance(id: string): Promise<IBalance> {
    const transactions = await this.findByUserId(id);
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

  findByUserId(user_id: string): Promise<Transaction[]> {
    return this.ormRepository.find({ where: { user_id } });
  }

  findOneByUserId(user_id: string): Promise<Transaction | undefined> {
    return this.ormRepository.findOne({ where: { user_id } });
  }

  async create({
    type,
    title,
    value,
    category,
    user_id,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      type,
      title,
      value,
      category,
      user_id,
    });
    await this.ormRepository.save(transaction);
    return transaction;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.ormRepository.save(transaction);
  }

  async findByIdAndUserId(
    user_id: string,
    id: string,
  ): Promise<Transaction | undefined> {
    return this.ormRepository.findOne({ user_id, id });
  }

  async remove(transaction: Transaction): Promise<void> {
    this.ormRepository.remove(transaction);
  }
}

export default TransactionsRepository;
