import 'express-async-errors'
import express, { ErrorRequestHandler } from 'express'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = express()

app.use(express.json())
app.use(usersRoutes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  if (error instanceof ZodError) {
    response.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
    return
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  response.status(500).send({
    message: 'Internal server error',
  })
}

app.use(errorHandler)
