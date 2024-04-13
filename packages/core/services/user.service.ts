import type { ApiService, IPagination, IUserService, User } from "../interfaces"

export class UserService implements IUserService {
  private readonly apiEndpoint = "https://dummyjson.com/users"
  constructor(private api: ApiService) {}

  getUsers(pagination?: {
    limit: number
    skip: number
  }): Promise<IPagination<User>> {
    let url = this.apiEndpoint
    if (pagination) {
      const { limit, skip } = pagination
      url = `${url}?limit=${limit}&skip=${skip}`
    }
    return this.api.get(url)
  }
  getUser(id: number): Promise<User | undefined> {
    return this.api.get(`${this.apiEndpoint}/${id}`)
  }
}
