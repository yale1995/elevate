import { User, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(user: Prisma.UserCreateInput) {
    const users = {
      id: randomUUID(),
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }

    this.users.push(users)

    return users
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) {
      return null
    }

    return user
  }
}
