import { Router } from 'express'
import { register } from './register'
import { authenticate } from './authenticate'

export const usersRoutes = Router()

usersRoutes.post('/users/register', async (request, response) => {
  await register(request, response)
})

usersRoutes.post('/users/authenticate', async (request, response) => {
  await authenticate(request, response)
})
