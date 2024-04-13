import { User } from "./user"

export interface IPagination<T> {
  limit: number
  skip: number
  total: number
  users: T[]
}

export interface IUserService {
  getUsers(pagination?: {
    limit: number
    skip: number
  }): Promise<IPagination<User>>
  getUser(id: number): Promise<User | undefined>
}
