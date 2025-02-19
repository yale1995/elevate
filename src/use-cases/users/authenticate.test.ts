import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { it, describe, expect } from 'vitest'
import { AuthenticateUserUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

describe('Authenticate User Use Case', () => {
  it('should be able to authenticate a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('123456', 6),
    })

    const { user } = await authenticateUserUseCase.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('123456', 6),
    })

    await expect(
      authenticateUserUseCase.execute({
        email: 'invalid-email',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hash('123456', 6),
    })

    await expect(
      authenticateUserUseCase.execute({
        email: 'john.doe@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
