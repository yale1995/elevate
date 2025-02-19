import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, describe, expect, beforeEach } from 'vitest'
import { AuthenticateUserUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: AuthenticateUserUseCase

describe('Authenticate User Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('123456', 6),
    })
  })

  it('should be able to authenticate a user', async () => {
    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'invalid-email',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(
      sut.execute({
        email: 'john.doe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
