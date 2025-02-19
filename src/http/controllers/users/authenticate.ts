import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { Request, Response } from 'express'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authenticate = async (request: Request, response: Response) => {
  try {
    const { email, password } = authenticateBodySchema.parse(request.body)
    const authenticateUserUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUserUseCase.execute({
      email,
      password,
    })

    return response.status(200).json({ user })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return response.status(400).send({
        message: error.message,
      })
    }

    throw error
  }
}
