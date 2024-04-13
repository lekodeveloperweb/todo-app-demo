import { ApiService, IPagination } from "../interfaces"
import { UserService } from "./user.service"

const mockGet = jest.fn<Promise<any>, [url: string]>()
const mockPost = jest.fn<Promise<any>, [url: string, data: any]>()
const mockPut = jest.fn<Promise<any>, [url: string, data: any]>()
const mockDelete = jest.fn<Promise<any>, [url: string]>()
const mockApiService: ApiService = {
  get: (url: string) => mockGet(url),
  post: (url: string, data: any) => mockPost(url, data),
  put: (url: string, data: any) => mockPut(url, data),
  delete: (url: string) => mockDelete(url),
}

describe("User Service", () => {
  let userService: UserService
  const mockData = { id: 1, name: "test" }
  beforeEach(() => {
    userService = new UserService(mockApiService)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("should create a correct service instance", () => {
    expect(userService).toBeDefined()
  })
  it("should get all users", async () => {
    const expected = {
      users: [mockData],
      limit: 0,
      skip: 0,
      total: 1,
    } satisfies IPagination<any>
    mockGet.mockResolvedValue(expected)
    const response = await userService.getUsers()
    expect(response).toBeDefined()
    expect(response.total).toBe(1)
    expect(response).toEqual(expected)
    expect(mockGet).toHaveBeenCalledWith("https://dummyjson.com/users")
  })
  it("should get all users with pagination", async () => {
    const expected = {
      users: [mockData],
      limit: 10,
      skip: 0,
      total: 1,
    } satisfies IPagination<any>
    mockGet.mockResolvedValue(expected)
    const response = await userService.getUsers({ limit: 10, skip: 0 })
    expect(response).toBeDefined()
    expect(response.total).toBe(1)
    expect(response).toEqual(expected)
    expect(mockGet).toHaveBeenCalledWith(
      "https://dummyjson.com/users?limit=10&skip=0"
    )
  })
  it("should get a user by id", async () => {
    mockGet.mockResolvedValue(mockData)
    const response = await userService.getUser(1)
    expect(response).toBeDefined()
    expect(response).toEqual(mockData)
    expect(mockGet).toHaveBeenCalledWith("https://dummyjson.com/users/1")
  })
})
