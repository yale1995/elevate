import { z } from 'zod'
import { Request, Response } from 'express'

import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

const registerBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

export const register = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })

    return response.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}
