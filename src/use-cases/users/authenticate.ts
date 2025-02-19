import { UsersRepository } from '@/repositories/users-repository'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

type AuthenticateUserUseCaseRequest = {
  email: string
  password: string
}

export class AuthenticateUserUseCase {
  constructor(private usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({ email, password }: AuthenticateUserUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
