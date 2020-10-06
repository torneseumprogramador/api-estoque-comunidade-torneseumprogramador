import Category from '../infra/typeorm/entities/Category';

export default interface ICreateTransactionDTO {
  user_id: string;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: Category;
}
