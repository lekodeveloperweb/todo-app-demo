import type { ApiService } from "../interfaces/api.service"

export class FetchApiImpl implements ApiService {
  get<T>(url: string): Promise<T> {
    return fetch(url).then((response) => response.json())
  }
  post<T>(url: string, data: any): Promise<T> {
    throw new Error("Method not implemented.")
  }
  put<T>(url: string, data: any): Promise<T> {
    throw new Error("Method not implemented.")
  }
  delete<T>(url: string): Promise<T> {
    throw new Error("Method not implemented.")
  }
}
