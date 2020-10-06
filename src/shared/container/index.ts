import ITransactionsRepository from '@modules/transactions/infra/typeorm/repositories/ITransactionRepository';
import TransactionsRepository from '@modules/transactions/repositories/TransactionsRepository';
import { container } from 'tsyringe';
import './providers';

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);
