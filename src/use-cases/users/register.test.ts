import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { compare } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: RegisterUseCase // system under test

describe('Register Use Case', () => {
  beforeEach(() => {
    // its a way to the database starts always clean
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register a new user with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password)
    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
