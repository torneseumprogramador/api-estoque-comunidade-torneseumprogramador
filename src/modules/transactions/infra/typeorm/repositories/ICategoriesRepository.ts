import Category from '../entities/Category';

export default interface ICategoriesRepository {
  findById(id: string): Promise<Category | undefined>;
  findAll(): Promise<Category[]>;
}
