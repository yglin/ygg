export interface IDataAccessor<T> {
  get(id: string): Promise<T>;
}
