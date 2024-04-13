import type { IPagination, IUserService, User } from "@eleos/core"

type Pagination = {
  limit: number
  skip: number
}

export const mockGetUsers = jest.fn<
  Promise<IPagination<User>>,
  [pagination?: Pagination]
>()
export const mockGetUser = jest.fn<Promise<User>, [number]>()
export class UserServiceMock implements IUserService {
  getUsers = mockGetUsers
  getUser = mockGetUser
}

export const generateUsers = (count: number) =>
  Array.from(new Array(count)).map(
    (_, i) =>
      ({
        id: i,
        firstName: `User ${i}`,
        lastName: `Last Name`,
        username: `username${i}`,
        email: `user${i}@fakemail.com`,
        phone: "+1234567890",
        birthDate: `1990-01-${i > 9 ? i : `0${i}`}`,
        age: i * 30 || 30,
        image: "https://randomuser",
        address: {
          address: `Address ${i}`,
          city: `City ${1}`,
          postalCode: `1234-12${i}`,
          state: `State ${i}`,
        },
        company: {
          name: `Company ${i}`,
          title: `Title ${i}`,
        },
      } as User)
  )
