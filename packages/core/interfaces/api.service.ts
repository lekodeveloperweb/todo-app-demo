export interface ApiService {
  get<T>(url: string): Promise<T>
  post<T, R>(url: string, data: T): Promise<R>
  put<T, R>(url: string, data: Omit<Partial<T>, "id">): Promise<R>
  delete<T>(url: string): Promise<T>
}
